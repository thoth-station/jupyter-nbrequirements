import * as utils  from './utils';

// Types
import { Message } from './notebook';

// Jupyter RequireJS runtime environment
const _ = require("underscore")
const events = require("base/js/events")
const Jupyter = require("base/js/namespace")
const Notebook = require("notebook/js/notebook").Notebook

const DEFAULT_PYTHON_INDENT: number = 4


export interface Requirements {
    "dev-python_packages": Object
    python_packages: Object
    requires: Object
    source: Object[]
}

class PackageVersion {
    constructor(version: string) { /* TODO */ }

    to_pipfile(): any { /* TODO */ }
}

class Source { /* TODO */ }


export function execute_python_script(script: string, callbacks?, options?, context?): Promise<void> {
    return new Promise(resolve => {
        // TODO
    })
}

export function gather_library_usage(cells?: Array<{ cell_type: string; source: string }>): Promise<string[]> {
    return new Promise(async (resolve) => {

        cells = cells || Jupyter.notebook.toJSON().cells

        console.log("Gathering requirements from cells, ", cells)

        cells.forEach((c, i: number) => {
            const source: string = c.source
                .trim()
                .replace("?", "")  // remove Jupyter magic to display help
                .replace(/^[%!]{1}[^%]{1}.*$/gm, "\n")  // remove lines starting with single % or !
                .replace(/^\s*\n/gm, "")     // remove empty lines

            c.source = source
        })

        cells = cells.filter(c => (c.cell_type === "code") && (!c.source.startsWith("%%")))

        let kernel = Jupyter.notebook.kernel
        let notebook_content: string = cells.map(c => c.source).join("\n")

        notebook_content = utils.indent(notebook_content, DEFAULT_PYTHON_INDENT * 3)

        console.debug("Notebook content: ", notebook_content)

        let script: string = utils.dedent(`
            import ast
            import distutils

            from pathlib import Path
            from invectio.lib import InvectioVisitor

            _STD_LIB_PATH = Path(sysconfig.get_python_lib(standard_lib=True))
            _STD_LIB = {p.name.rstrip(".py") for p in _STD_LIB_PATH.iterdir()}

            ast = ast.parse('''
            ${notebook_content}
            ''')

            visitor = InvectioVisitor()
            visitor.visit(ast)

            report = visitor.get_module_report()

            libs = filter(
                lambda k: k not in _STD_LIB | set(sys.builtin_module_names), report
            )

            list(libs)
        `)

        let callback: Function = (msg: Message) => {
            console.debug("Execution callback: ", msg)
            if (msg.msg_type == "error") {
                throw new Error(`Script execution error: ${msg.content.ename}: ${msg.content.evalue}`)
            }

            const result = msg.content.data["text/plain"].replace(/\'/g, '"')
            const requirements = JSON.parse(result)

            resolve(requirements)
        }

        await execute_python_script(script, { iopub: { output: callback } })
    })
}


Notebook.prototype.set_requirements = function (requirements: Requirements): void {
    let metadata = Jupyter.notebook.metadata

    if (_.isUndefined(metadata.requirements)) {
        metadata.requirements = requirements
    } else {
        console.debug("Notebook requirements already exist. Updating.")
        // update the notebook metadata
        _.assign(metadata.requirements, requirements)
    }

    console.log("Notebook requirements have been set successfully.")
}


Notebook.prototype.get_requirements = function (ignore_metadata = false) {
    return new Promise(async (resolve) => {
        console.log("Reading notebook requirements.")

        let requirements = Jupyter.notebook.metadata.requirements

        if (_.isUndefined(requirements) || ignore_metadata) {
            console.log("Requirements are not defined.")

            requirements = gather_library_usage()
                .then((r) => {
                    let python_packages = {}

                    r.forEach((p) => {
                        let python_package = new PackageVersion(p.toLocaleLowerCase())

                        _.assign(python_packages, python_package.to_pipfile())
                    })

                    let kernel = Jupyter.notebook.kernel
                    let language_info = kernel.info_reply.language_info

                    const python_version = language_info.version
                    const requires = { python_version: python_version.match(/\d.\d/)[0] }

                    return { python_packages: python_packages, requires: requires, source: [new Source()] }
                })
                .catch(console.error)

            resolve(requirements)
        }

        resolve(requirements)
    })
}