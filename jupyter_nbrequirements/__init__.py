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

import json

from pathlib import Path

from IPython.core.magic import line_cell_magic
from IPython.core.magic import magics_class
from IPython.core.magic import Magics

from jupyter_require import execute as executejs
from thoth.python import Pipfile

from .magic_parser import MagicParser


_HERE = Path(__file__).parent


def _requirements(args) -> str:
    """Return script to be executed on `requirements` command."""
    sub_command = f"_{args.script}" if args.script else ""

    with open(_HERE / f"static/requirements{sub_command}.js") as f:
        script = f.read()
    
    return script


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

            subparsers = parser.add_subparsers(dest="script")

            # subcommand: lock
            parser_lock = subparsers.add_parser(
                "lock",
                help="Lock (pin down) dependencies."
            )
            parser_lock.add_argument(
                "-b", "--backend",
                type=str,
                choices=("pipenv", "thoth"),
                default="thoth",
                help="Backend to be used for locking dependencies."
            )
            parser_lock.set_defaults(func=_requirements)

            # subcommand: config
            parser_config = subparsers.add_parser(
                "config",
                help="Generate Thoth config."
            )
            parser_config.set_defaults(func=_requirements)

            # subcommand: install
            parser_install = subparsers.add_parser(
                "install",
                help="Install pinned down dependencies."
            )
            parser_install.set_defaults(func=_requirements)

            # subcommand: kernel
            parser_kernel = subparsers.add_parser(
                "kernel",
                help="Create new Jupyter kernel."
            )
            parser_kernel.set_defaults(func=_requirements)

            opts = line.split()

            if any([opt in {"-h", "--help"} for opt in opts]):
                # print help and return
                return

            args = parser.parse_args(opts)

            script = args.func(args)
            params["magic_args"] = json.dumps(args.__dict__, default=lambda s: repr(s))

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
