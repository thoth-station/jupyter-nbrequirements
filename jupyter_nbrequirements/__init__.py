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

from IPython.core.magic import line_cell_magic
from IPython.core.magic import magics_class
from IPython.core.magic import Magics

from jupyter_require import execute as executejs

from thamos.config import config
from thamos.config import workdir

from thoth.python import Pipfile

from .magic_parser import MagicParser


_HERE = Path(__file__).parent


def _requirements(args, params: dict = None, **kwargs) -> str:
    """Return script to be executed on `requirements` command."""
    params = params or dict()

    try:
        sub_command = f"_{args.command}" if args.command is not None else ""
    except AttributeError:
        sub_command = ""

    with open(_HERE / f"static/requirements{sub_command}.js") as f:
        script = f.read()
    
    params.update(kwargs)
    params["magic_args"] = json.dumps(args.__dict__, default=lambda s: repr(s))

    return script, params


def _requirements_config(args):
    """Return script to be executed on `requirements` command."""
    content = None

    # TODO: Allow the user to edit the file directly in Jupyter

    if args.to_file:
        if config.config_file_exists() and not args.overwrite:
            raise Exception("Config file already exists and `overwrite` is not set.")

        config.create_default_config()
        script = f"console.log('Default Thoth config file has been created:', {json.dumps(config.content)})"

        return script, {}

    if not config.config_file_exists():
        content: dict = config.create_default_config(nowrite=True)
        script = f"console.log('Default Thoth config:', {json.dumps(content)})"
    else:
        script = f"console.log('Thoth config file content:', {json.dumps(config.content)})"

    if args.to_json:
        print(json.dumps(config.content, indent=4))
    else:
        with workdir(config.CONFIG_NAME) as config_dir:
            print(
                Path(config_dir, config.CONFIG_NAME).read_text()
            )

    return script, {}

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
            Jupyter.notebook.set_requirements($$requirements)
            """
            params["requirements"] = json.dumps(requirements)

        else:
            parser = MagicParser(prog="%requirements")
            parser.set_defaults(func=_requirements)

            # main
            parser.add_argument(
                "-i", "--ignore-metadata",
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

            # subcommand: lock
            parser_lock = subparsers.add_parser(
                "lock",
                add_help=False,
                parents=[parser],
                description="Lock (pin down) dependencies."
            )
            parser_lock.set_defaults(func=_requirements)

            # subcommand: config
            parser_config = subparsers.add_parser(
                "config",
                add_help=False,
                parents=[parser],
                description="Generate Thoth config."
            )
            parser_config.set_defaults(func=_requirements_config)

            # subcommand: install
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

            # subcommand: kernel
            parser_kernel = subparsers.add_parser(
                "kernel",
                description="Install and manage Jupyter kernels."
            )
            parser_kernel_subparser = parser_kernel.add_subparsers(dest="sub_command") 

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

    ipython.register_magics(RequirementsMagic)


def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'js',
        'dest': 'jupyter-nbrequirements',
        'require': 'jupyter-nbrequirements/extension'
    }]
