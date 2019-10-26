/**
 * Thoth.
 *
 * Thoth recommendation engine and types.
 *
 * @link   https://github.com/CermakM/jupyter-nbrequirements#readme
 * @file   This file implements Thoth recommendation engine and types.
 * @author Marek Cermak <macermak@redhat.com>
 * @since  0.0.1
 */

import _ from "lodash"

import { getLogger } from "./config"

import {
    execute_python_script,
    get_execute_context,
    execute_shell_command,
    execute_shell_script
} from "./core"
import {
    set_requirements,
    get_requirements,
    set_requirements_locked,
    get_requirements_locked,
} from "./notebook"

import * as utils from "./utils"
import { RequirementsLockedProxy } from "./requirements"

import * as io from "./types/io"
import { CodeCell, Context } from "./types/nb"
import { Meta, Requirements, RequirementsLocked } from "./types/requirements"

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require( "base/js/namespace" )


const Logger = getLogger( "thoth" )

/**
 * A package version as described in the Pipfile.lock entry.
 *
 * @export
 * @class PackageVersion
 */
export class PackageVersion {
    private readonly _semantic_version: string | undefined
    private readonly _version_spec: string | undefined

    constructor(
        public readonly name: string,
        public readonly version: string = "*",
        public readonly develop: boolean = false,
        public readonly index?: Source,
        public hashes?: string[],
        public markers?: string,
    ) { }

    /**
     * Generate Pipfile entry for the given package.
     *
     * @returns {{ [name: string]: any }}
     * @memberof PackageVersion
     */
    public get_pipfile_entry(): { [ name: string ]: any } {
        const result: any = {}
        Logger.log( "Generating Pipfile entry for package: ", this.name )

        if ( !_.isUndefined( this.index ) )
            result[ "index" ] = this.index.name
        if ( !_.isUndefined( this.markers ) )
            result[ "markers" ] = this.markers
        if ( _.isEmpty( result ) ) {
            // Only version information is available.
            return { [ this.name ]: this.version }
        }
        result[ "version" ] = this.version

        return { [ this.name ]: result }
    }
}

/**
 * A Pipfile representation - representation of direct dependencies of an application.
 *
 * @export
 * @class Pipfile
 */
export class Pipfile {
    constructor(
        public packages: any,
        public dev_packages: any,
        public meta: any
    ) { }

    /**
     * Create and write the Pipfile
     *
     * @static
     * @param {Requirements} requirements  notebook requirements
     * @param {boolean} [overwrite=false]  whether to overwrite existing Pipfile
     * @param {boolean} [sync=true]        whether to sync with notebook requirements
     * @returns Promise<Requirements>
     * @memberof Pipfile
     */
    public static create( { requirements, overwrite = false, sync = true }: { requirements: Requirements; overwrite?: boolean; sync?: boolean; } ): Promise<Requirements> {
        return new Promise( async ( resolve, reject ) => {

            if ( _.isUndefined( requirements ) )
                requirements = await get_requirements( Jupyter.notebook )

            Logger.log( "Writing notebook requirements to the Pipfile." )

            const script = `
            import os
            import json
            import logging

            from pathlib import Path
            from thoth.python import Pipfile

            # Either use global LOGGER or get logger for the pipfile module
            _log = os.environ.get('LOGGER', logging.getLogger('pipfile'))

            if Path("Pipfile").exists() and "${overwrite }" != "true":
                reason = "Pipfile already exists and \`overwrite\` is not set."
                _log.warning(reason)

                raise FileExistsError(reason)

            requirements: dict = json.loads("""${JSON.stringify( requirements ) }""")
            pipfile = Pipfile.from_dict(requirements)
            pipfile.to_file()

            pipfile.to_string()
            `
            const callback = ( msg: io.Message ) => {
                Logger.debug( "Execution callback: ", msg )
                if ( msg.metadata.status != 0 ) {
                    reject( msg.metadata.output )
                }
                else if ( msg.msg_type === "stream" ) {
                    // let codecell handle the callback and append the stream to the output
                    const context: Context | undefined = get_execute_context( Logger )
                    if ( !_.isUndefined( context ) ) {
                        const cell: CodeCell = context.cell

                        cell.events.trigger( "set_dirty.Notebook", { value: true } )
                        cell.output_area.handle_output( msg )
                    }
                    return
                }

                else if ( msg.msg_type === "execute_result" ) {

                    Logger.log( "Pipfile has been created successfully: ", msg.content.data[ "text/plain" ] )

                    if ( sync ) {
                        // sync notebook metadata with the Pipfile
                        set_requirements( Jupyter.notebook, requirements )
                        Logger.log( "Notebook requirements have been synced with Pipfile." )
                    }
                    resolve( requirements )
                }
            }

            await execute_python_script(
                script,
                { iopub: { output: callback } }, { logger: Logger }
            )
                .catch( err => { throw err } )
        } )
    }
}

export class PipfileLock {
    public readonly "default": PackageVersion[]

    constructor(
        packages: PackageVersion[],
        public readonly develop: PackageVersion[],
        public readonly _meta?: Meta
    ) {
        this.default = packages
    }

    public static create( { requirements_locked, ignore_metadata = false, sync = true }: { requirements_locked: RequirementsLocked; ignore_metadata?: boolean; sync?: boolean; } ): Promise<void> {
        return new Promise( async ( resolve, reject ) => {

            if ( _.isUndefined( requirements_locked ) ) {
                requirements_locked = await get_requirements_locked(
                    Jupyter.notebook,
                    ignore_metadata,
                    sync
                )
            }

            Logger.log( "Writing notebook locked requirements to the Pipfile.lock." )

            const script = `
            requirements_locked = json.loads("""${JSON.stringify( requirements_locked, null, 4 ) }""")

            Path("Pipfile.lock").write_text(
                json.dumps(requirements_locked, sort_keys=True, indent=4),
                encoding='utf-8'
            )`

            const callback = ( msg: io.Message ) => {
                Logger.debug( "Execution callback: ", msg )

                if ( msg.metadata.status != 0 ) {
                    reject( msg.metadata.output )
                } else {
                    resolve()
                }
            }

            await execute_python_script(
                script,
                { shell: { reply: callback } }, { logger: Logger }
            )
                .catch( err => { throw err } )
        } )
    }
}

export class Source {
    constructor(
        public readonly name: string = "pypi",
        public readonly url: string = "https://pypi.org/simple",
        public readonly verify_ssl: boolean = true,
        public warehouse?: string,
        public warehouse_api_url?: string
    ) { }
}


export function gather_library_usage( cells?: CodeCell[] ): Promise<string[]> {
    const default_python_indent = 4

    return new Promise( async ( resolve, reject ) => {

        cells = cells || Jupyter.notebook.toJSON().cells as CodeCell[]
        Logger.log( "Gathering requirements from cells, ", cells )

        cells.forEach( ( c ) => {
            const source: string = c.source
                .trim()
                .replace( "?", "" )  // remove Jupyter magic to display help
                .replace( /^[%!]{1}[^%]{1}.*$/gm, "\n" )  // remove lines starting with single % or !
                .replace( /^\s*\n/gm, "" )     // remove empty lines

            c.source = source
        } )

        cells = cells.filter( c => ( c.cell_type === "code" ) && ( !c.source.startsWith( "%%" ) ) )

        let notebook_content: string = cells.map( c => c.source ).join( "\n" )

        notebook_content = utils.indent( notebook_content, default_python_indent * 3 )

        Logger.debug( "Notebook content: ", notebook_content )

        // TODO: Move this to templates
        const script: string = utils.dedent( `
            _STD_LIB_PATH = Path(distutils.sysconfig.get_python_lib(standard_lib=True))
            _STD_LIB = {p.name.rstrip(".py") for p in _STD_LIB_PATH.iterdir()}

            tree = ast.parse('''
            \n${ notebook_content }
            ''')

            visitor = invectio.lib.InvectioVisitor()
            visitor.visit(tree)

            report = visitor.get_module_report()

            libs = filter(
                lambda k: k not in _STD_LIB | set(sys.builtin_module_names), report
            )
            list(libs)
        ` )

        const callback = ( msg: io.Message ) => {
            Logger.debug( "Execution callback: ", msg )
            if ( msg.metadata.status != 0 ) {
                reject( msg.metadata.output )
            }
            else {

                const result: string = msg.content.data[ "text/plain" ].replace( /\'/g, "\"" )
                const requirements: string[] = JSON.parse( result )

                resolve( requirements )
            }
        }

        await execute_python_script(
            script,
            { iopub: { output: callback } }, { logger: Logger }
        )
            .catch( err => { throw err } )
    } )
}


export function lock_requirements(
    requirements: Requirements | undefined,
    sync = true
): Promise<RequirementsLocked> {
    return new Promise( async ( resolve, reject ) => {

        if ( _.isUndefined( requirements ) )
            requirements = await get_requirements( Jupyter.notebook )

        // we want Pipfile to be synced with Pipfile.lock, always overwrite
        await Pipfile.create( { requirements, overwrite: true, sync: sync } )

        // TODO: send REST request (ajax?) directly instead of using Python lib here
        const command = `
            results = thamos.lib.advise_here(
                nowait=False,
                no_static_analysis=True  # static analysis is not yet functional for Jupyter NBs
            )

            if not results:
                raise Exception("Analysis was not successful.")

            result, error = results
            report = result["report"]

            if not error:
                pipfile = report[0][1]["requirements"]
                pipfile_lock = report[0][1]["requirements_locked"]
            else:
                raise Exception(f"Errors occurred: {result}")

            json.dumps(pipfile_lock)
        `

        const timeout = setTimeout( () => {
            // interrupt the running script
            Jupyter.notebook.kernel.interrupt()

            reject( new Error( "Timeout exceeded: Locking requirements was not successful." ) )
        }, 3000 * 60 )

        const callback = ( msg: io.Message ) => {
            Logger.debug( "Execution callback: ", msg )

            if ( msg.metadata.status != 0 ) {
                reject( msg.metadata.output )
            }
            else if ( msg.msg_type == "stream" ) {  // adviser / pipenv log messages
                Logger.info( "[Thamos]: ", msg.metadata.output )
                return
            }

            else if ( msg.msg_type == "execute_result" ) {
                clearTimeout( timeout )

                const result = msg.content.data[ "text/plain" ].replace( /(^')|('$)/g, "" )
                const requirements_locked: RequirementsLocked = RequirementsLockedProxy.Parse( result )

                if ( sync ) {
                    // sync requirements locked with Pipfile.lock
                    set_requirements_locked( Jupyter.notebook, requirements_locked )
                    Logger.log( "Locked requirements have been synced with Pipfile." )
                }

                resolve( requirements_locked )
            }
            else
                reject( new Error( `Unknown message type: ${ msg.msg_type }` ) )
        }

        await execute_python_script(
            command,
            { iopub: { output: callback } }, { logger: Logger }
        )
            .catch( err => { throw err } )
    } )
}

export function lock_requirements_with_pipenv(
    dev_packages = false,
    pre_releases = false,
    sync = true
): Promise<RequirementsLocked> {
    return new Promise( async ( resolve, reject ) => {
        let requirements_locked: RequirementsLocked

        /**
         * Logging callback
         */
        const iopub_callback = ( msg: io.Message ) => {
            Logger.debug( "Execution logging callback: ", msg )

            if ( msg.metadata.status != 0 ) {
                reject( msg.metadata.output )
            }

            else if ( msg.msg_type == "stream" ) {  // pipenv log messages
                const stream = msg.content.name || "stdout"
                const text = utils.parse_console_output( msg.metadata.output )

                if ( stream === "stderr" ) {
                    Logger.warn( "[pipenv]: ", text )
                } else if ( text.length > 0 )
                    Logger.log( "[pipenv]: ", text )
            }
        }

        /**
         * Output callback
         */
        const output_callback = ( msg: io.Message ) => {
            Logger.debug( "Execution output callback: ", msg )

            if ( msg.metadata.status != 0 ) {
                reject( msg.metadata.output )
            }
            else if ( msg.msg_type == "stream" ) {  // pipenv output
                const content: string = msg.metadata.output

                requirements_locked = RequirementsLockedProxy.Parse( content )
            }
        }

        /**
         * Execution done callback
         */
        const shell_callback = ( msg: io.Message ) => {
            Logger.debug( "Execution shell callback: ", msg )

            if ( msg.metadata.status != 0 ) {
                reject( msg.metadata.output )
            }

            else if ( _.isUndefined( requirements_locked ) ) {
                reject( new Error( "Requirements locked are not defined." ) )
            }

            else {

                Logger.log( "Requirements have been successfully locked." )

                if ( sync ) {
                    // sync requirements locked with Pipfile.lock
                    set_requirements_locked( Jupyter.notebook, requirements_locked )
                    Logger.log( "Locked requirements have been synced with Pipfile." )
                }

                resolve( requirements_locked )

            }
        }


        let opts = ""

        if ( dev_packages ) opts += "--dev "
        if ( pre_releases ) opts += "--pre"

        Logger.log( "Locking requirements w/ Pipenv: " )

        await execute_shell_command(
            `pipenv lock ${ opts }`,
            { iopub: { output: iopub_callback } }
        )
            .catch( err => { throw err } )

        await execute_shell_command(
            "cat Pipfile.lock",
            { iopub: { output: output_callback }, shell: { reply: shell_callback } }, { logger: Logger }
        )
            .catch( err => { throw err } )
    } )
}

export function install_requirements(
    requirements: string[],
    dev_packages = false,
    pre_releases = false
): Promise<void> {
    return new Promise( async ( resolve, reject ) => {

        requirements = requirements || []

        /**
         * Logging callback
         */
        const iopub_callback = ( msg: io.Message ) => {
            Logger.debug( "Execution logging callback: ", msg )

            if ( msg.metadata.status != 0 ) {
                reject( msg.metadata.output )
            }

            else if ( msg.msg_type == "stream" ) {  // adviser / pipenv log messages
                const stream = msg.content.name || "stdout"
                const text = utils.parse_console_output( msg.metadata.output )

                if ( stream === "stderr" ) {
                    Logger.warn( "[pipenv]: ", text )
                } else
                    Logger.log( "[pipenv]: ", text )

            }
        }

        /**
         * Execution done callback
         */
        const shell_callback = ( msg: io.Message ) => {
            Logger.debug( "Execution shell callback: ", msg )

            if ( msg.metadata.status != 0 ) {
                reject( msg.metadata.output )
            }

            Logger.log( "Requirements have been successfully installed" )

            resolve()
        }


        let opts = ""

        if ( dev_packages ) opts += "--dev "
        if ( pre_releases ) opts += "--pre"

        Logger.log( "Installing requirements." )

        await execute_shell_command(
            `pipenv install --ignore-pipfile --keep-outdated ${ opts } ${ requirements }`,
            { iopub: { output: iopub_callback }, shell: { reply: shell_callback } }, { logger: Logger }
        )
            .catch( err => { throw err } )
    } )
}

export function install_kernel( name: string ): Promise<string> {
    return new Promise( async ( resolve, reject ) => {

        /**
         * Logging callback
         */
        const iopub_callback = ( msg: io.Message ) => {
            Logger.debug( "Execution logging callback: ", msg )

            if ( msg.metadata.status != 0 ) {
                reject( msg.metadata.output )
            }

            else if ( msg.msg_type == "stream" ) {  // adviser / pipenv log messages
                const stream = msg.content.name || "stdout"
                const text = utils.parse_console_output( msg.metadata.output )

                if ( stream === "stderr" ) {
                    Logger.warn( "[pipenv]: ", text )
                } else
                    Logger.log( "[pipenv]: ", text )

            }
        }

        let kernel_name: string = name || Jupyter.notebook.notebook_name
            .replace( ".ipynb", "" )
            .replace( /\s+/g, "_" )

        kernel_name = kernel_name.toLowerCase()

        // check if ipython and ipykernel are both installed
        const script = utils.dedent( `
            PACKAGE_LIST=$(pipenv run pip list | cut -d' ' -f 1)

            if [[ $(echo $PACKAGE_LIST | grep -E "ipython\$|ipykernel\$" | wc -l) != 2 ]]; then
                echo "Packages 'ipython' and 'ipykernel are already installed'"
            else
                echo "Installing required packages: 'ipython', 'ipykernel'"
                pipenv run pip install ipython ipykernel
            fi
        ` )

        Logger.log( `Installing kernel ${ kernel_name }.` )

        await execute_shell_script( script, { iopub: { output: iopub_callback } } )
            .then( async () => {
                await execute_shell_command(
                    `pipenv run ipython kernel install --user --name=${ kernel_name }`,
                    { iopub: { output: iopub_callback } },
                    { logger: Logger }
                )
                Logger.log( `Kernel '${ kernel_name }' has been installed.` )
            } )
            .catch( reject )

        resolve( kernel_name )
    } )
}
