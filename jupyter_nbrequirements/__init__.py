# jupyter-nbrequirements
# Copyright 2019 Marek Cermak <macermak@redhat.com>
#
# MIT License
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

"""Jupyter magic extension for managing notebook requirements."""

import argparse
import re
import sys
import json

from pathlib import Path
from textwrap import dedent

from IPython.core.magic import line_cell_magic
from IPython.core.magic import magics_class
from IPython.core.magic import Magics

from jupyter_require import execute as executejs

from thamos.config import config as thoth_config
from thamos.config import workdir

from thoth.python import Pipfile

from .magic_parser import MagicParser


_HERE = Path(__file__).parent


def _requirements(args, params: dict = None, **kwargs) -> str:
    """Return script to be executed on `requirements` command."""
    params = params or dict()

    default_command = "get"
    try:
        command = f"{args.command}" if args.command is not None else default_command
    except AttributeError:
        # %requirements is an alias to 'get' if no command is provided
        command = default_command

    script = """
    require(['nbrequirements'], ({cli, version}) => {
        cli('%s', $$magic_args, element, context)
    })
    """ % command

    params.update(kwargs)
    params["magic_args"] = json.dumps(args.__dict__, default=lambda s: repr(s))

    return script, params


def _requirements_config(args):
    """Return script to be executed on `requirements config` command."""
    content = None

    # TODO: Allow the user to edit the file directly in Jupyter

    if args.to_file:
        with workdir():
            fp = Path(thoth_config.CONFIG_NAME)

            if fp.exists() and not args.overwrite:
                raise Exception(
                    "Config file already exists and `overwrite` is not set.")

            thoth_config.create_default_config()

        script = f"console.log('Default Thoth config file has been created:', {json.dumps(thoth_config.content)})"
        return script, {}

    if not thoth_config.config_file_exists():
        content: dict = thoth_config.create_default_config(nowrite=True)
        script = f"console.log('Default Thoth config:', {json.dumps(content)})"
    else:
        script = f"console.log('Thoth config file content:', {json.dumps(thoth_config.content)})"

    if args.to_json:
        print(json.dumps(thoth_config.content, indent=4))
    else:
        with workdir(thoth_config.CONFIG_NAME) as config_dir:
            print(
                Path(config_dir, thoth_config.CONFIG_NAME).read_text()
            )

    return script, {}


def _requirements_lock(args):
    """Return script to be executed on `requirements config` command."""
    args.command = "lock"  # Workaround for subparsers with parser parser

    return _requirements(args)


@magics_class
class RequirementsMagic(Magics):
    """Jupyter magic for managing notebook requirements."""

    @line_cell_magic
    def requirements(self, line: str, cell: str = None):
        """
        Get or set notebook requirements.

        Line magic: Print notebook requirements

        :param line: arguments to `%requirements` magic (see `%%requiremnts --help`)
        :param cell: <empty>
        :return: None

        Cell magic: Set notebook requirements

        :param line: arguments to `%%requirements` magic (see `%requiremnts --help`)
        :param cell: Notebook requirements in Pipfile format.
        :return: None
        """
        params = dict()

        if cell is not None:
            requirements = Pipfile.from_string(cell).to_dict()

            script = """
            require(['nbrequirements'], ({cli, version}) => {
                cli('set', { requirements: $$requirements })
            })
            """
            params["requirements"] = json.dumps(requirements)

        else:
            parser = MagicParser(
                prog="%requirements",
                description="""
                Jupyter magic for managing notebook requirements.
                """
            )
            parser.set_defaults(func=_requirements)

            # main
            parser.add_argument(
                "-I", "--ignore-metadata",
                action="store_true",
                help="Whether to ignore embedded notebook metadata."
            )
            parser.add_argument(
                "--to-json",
                action="store_true",
                help="Whether to display output in JSON format."
            )
            parser.add_argument(
                "--to-file",
                action="store_true",
                help="Whether to store output to file."
            )
            parser.add_argument(
                "-w", "--overwrite",
                action="store_true",
                help="Whether to overwrite existing file."
            )

            subparsers = parser.add_subparsers(dest="command")

            # command: lock
            parser_lock = subparsers.add_parser(
                "lock",
                add_help=False,
                parents=[parser],
                description="Lock (pin down) dependencies."
            )
            parser_lock.add_argument(
                "--sync",
                action="store_true",
                help="Whether to sync notebook metadata with the Pipfile.lock."
            )
            parser_lock.set_defaults(func=_requirements_lock)

            # command: config
            parser_config = subparsers.add_parser(
                "config",
                add_help=False,
                parents=[parser],
                description="Generate Thoth config."
            )
            parser_config.set_defaults(func=_requirements_config)

            # command: install
            parser_install = subparsers.add_parser(
                "install",
                description=(
                    "Installs provided packages and adds them to Pipfile, "
                    "or (if no packages are given), installs all packages from Pipfile.lock."
                )
            )
            parser_install.add_argument(
                "requirements",
                type=str,
                nargs=argparse.REMAINDER,
                help=(
                    "[optional] Packages to be installed. "
                    "If not provided, install all packages from Pipfile.lock."
                )
            )
            parser_install.add_argument(
                "-d", "--dev",
                action="store_true",
                help="Install both develop and default packages."
            )
            parser_install.add_argument(
                "--pre",
                action="store_true",
                help="Allow pre-releases."
            )
            parser_install.set_defaults(func=_requirements)

            # command: kernel
            parser_kernel = subparsers.add_parser(
                "kernel",
                description="Install and manage Jupyter kernels."
            )
            parser_kernel_subparser = parser_kernel.add_subparsers(
                dest="sub_command")

            parser_kernel_install = parser_kernel_subparser.add_parser(
                "install",
                description="Install new Jupyter kernel."
            )
            parser_kernel_install.add_argument(
                "name",
                nargs="?",
                help="[optional] Kernel name, otherwise use notebook name."
            )

            parser_kernel_set = parser_kernel_subparser.add_parser(
                "set",
                description="Set existing kernel as current kernel."
            )
            parser_kernel_set.add_argument(
                "name",
                nargs="?",
                help="[optional] Kernel name, otherwise use notebook name."
            )
            parser_kernel.set_defaults(func=_requirements)

            opts = line.split()
            args = parser.parse_args(opts)

            if any([opt in {"-h", "--help"} for opt in opts]):
                # print help and return
                return

            script, params = args.func(args)

        return executejs(script, **params)


def load_ipython_extension(ipython):
    """Load the jupyter-nbrequirements extension."""
    imports = """\
    import ast
    import sys

    import json
    import distutils
            
    from pathlib import Path

    import invectio

    import thamos
    import thamos.cli
    import thamos.lib

    print("Initialized.")
    """
    # Populate runtime environment with the required libraries
    # so that we don't have to load it in the code snippets
    ipython.ex(dedent(imports))

    # Register the magic
    ipython.register_magics(RequirementsMagic)


def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'jupyter-nbrequirements',
        'require': 'jupyter-nbrequirements/extension'
    }]
