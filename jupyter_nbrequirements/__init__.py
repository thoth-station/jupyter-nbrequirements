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

from IPython.core.magic import line_cell_magic
from IPython.core.magic import magics_class
from IPython.core.magic import Magics

from jupyter_require import execute as executejs
from thoth.python import Pipfile

from .magic_parser import MagicParser


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
            parser.add_argument(
                "-i", "--ignore-metadata",
                action="store_true",
                help="Whether to ignore embedded notebook metadata."
            )
            parser.add_argument(
                "--to-string",
                action="store_true",
                help="Whether to display requirements in Pipfile string format."
            )
            parser.add_argument(
                "--to-file",
                action="store_true",
                help="Whether to store requirements to Pipfile."
            )
            parser.add_argument(
                "-w", "--overwrite",
                action="store_true",
                help="Whether to overwrite existing Pipfile."
            )
            parser.add_argument(
                "-l", "--lock",
                action="store_true",
                help="Whether to lock down dependencies."
            )
            parser.add_argument(
                "-b", "--backend",
                type=str,
                choices=("pipenv", "thoth"),
                default="thoth",
                help="Backend to be used for locking dependencies."
            )

            opts = line.split()
            args = parser.parse_args(opts)

            if any([opt in {"-h", "--help"} for opt in opts]):
                # print help and return
                return

            params["magic_args"] = json.dumps(args.__dict__)

            if args.lock:
                script = """
                const args = $$magic_args

                create_pipfile_lock(args.backend)
                    .then(() => {
                        console.log("Pipfile.lock was sucessfully created.")
                    })
                    .catch((err) => {
                        console.error("Failed to lock down dependencies.\n", err)
                    })
                """
            else:
                script = """
                const args = $$magic_args

                Jupyter.notebook.get_requirements(args.ignore_metadata)
                    .then( async (r) => {
                        if ( args.to_string ) {
                            r = JSON.stringify(r)

                            return await execute_python_script(
                                dedent`print(
                                    Pipfile.from_dict(json.loads('${r}')).to_string()
                                )`
                            )
                        }

                        if ( args.to_file ) {
                            return await create_pipfile(r, args.overwrite)
                        }

                        display(r, element)  // default, display and exit
                    })
                """

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
