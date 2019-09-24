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

import _ from 'lodash'

import * as io from './types/io'
import { CodeCell, Context } from './types/nb';
import { Meta, Requirements, RequirementsLocked } from './types/requirements';

import * as utils from './utils'
import { execute_python_script, get_execute_context, execute_shell_command } from './core';
import { set_requirements, get_requirements, set_requirements_locked, get_requirements_locked } from './notebook';
import { RequirementsLockedProxy } from './requirements';

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require( "base/js/namespace" )


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
    get_pipfile_entry(): { [ name: string ]: any } {
        const result: any = {}
        console.log( "Generating Pipfile entry for package: ", this.name )

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
    public static create( requirements: Requirements, overwrite: boolean = false, sync: boolean = true ): Promise<Requirements> {
        return new Promise( async ( resolve, reject ) => {

            if ( _.isUndefined( requirements ) )
                requirements = await get_requirements( Jupyter.notebook )

            console.log( "Creating Pipfile from notebook requirements." )

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
                console.debug( "Execution callback: ", msg )
                if ( msg.msg_type == "error" ) {
                    reject( `ERROR: ${ msg.content.ename }: ${ msg.content.evalue }` )
                    return
                }
                if ( msg.msg_type === "stream" ) {
                    // let codecell handle the callback and append the stream to the output
                    const context: Context | undefined = get_execute_context()
                    if ( !_.isUndefined( context ) ) {
                        const cell: CodeCell = context.cell

                        cell.events.trigger( 'set_dirty.Notebook', { value: true } );
                        cell.output_area.handle_output( msg );
                    }
                    return
                }

                if ( msg.msg_type === "execute_result" ) {

                    console.log( "Pipfile has been created successfully: ", msg.content.data[ "text/plain" ] )

                    if ( sync ) {
                        // sync notebook metadata with the Pipfile
                        set_requirements( Jupyter.notebook, requirements )
                        console.log( "Notebook requirements have been synced with Pipfile." )
                    }
                    resolve( requirements )
                }
            }

            await execute_python_script( script, { iopub: { output: callback } } )
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

    public static create( requirements_locked: RequirementsLocked, ignore_metadata = false, sync = true ): Promise<void> {
        return new Promise( async ( resolve, reject ) => {

            if ( _.isUndefined( requirements_locked ) ) {
                requirements_locked = await get_requirements_locked(
                    Jupyter.notebook,
                    ignore_metadata,
                    sync
                )
            }

            console.log( "Creating Pipfile.lock from notebook locked requirements." )

            let script = `
            requirements_locked = json.loads("""${JSON.stringify( requirements_locked, null, 4 ) }""")

            Path("Pipfile.lock").write_text(
                json.dumps(requirements_locked, sort_keys=True, indent=4),
                encoding='utf-8'
            )`

            const callback = ( msg: io.Message ) => {
                console.debug( "Execution callback: ", msg )
                if ( msg.msg_type == "error" ) {
                    reject( new Error( `ERROR: ${ msg.content.ename }: ${ msg.content.evalue }` ) )
                }

                resolve()
            }

            await execute_python_script( script, { shell: { reply: callback } } )
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


export function gather_library_usage( cells?: Array<CodeCell> ): Promise<string[]> {
    const default_python_indent: number = 4

    return new Promise( async ( resolve, reject ) => {

        cells = cells || Jupyter.notebook.toJSON().cells as Array<CodeCell>
        console.log( "Gathering requirements from cells, ", cells )

        cells.forEach( ( c, i: number ) => {
            const source: string = c.source
                .trim()
                .replace( "?", "" )  // remove Jupyter magic to display help
                .replace( /^[%!]{1}[^%]{1}.*$/gm, "\n" )  // remove lines starting with single % or !
                .replace( /^\s*\n/gm, "" )     // remove empty lines

            c.source = source
        } )

        cells = cells.filter( c => ( c.cell_type === "code" ) && ( !c.source.startsWith( "%%" ) ) )

        let kernel = Jupyter.notebook.kernel
        let notebook_content: string = cells.map( c => c.source ).join( "\n" )

        notebook_content = utils.indent( notebook_content, default_python_indent * 3 )

        console.debug( "Notebook content: ", notebook_content )

        // TODO: Move this to templates
        const script: string = utils.dedent( `
            _STD_LIB_PATH = Path(distutils.sysconfig.get_python_lib(standard_lib=True))
            _STD_LIB = {p.name.rstrip(".py") for p in _STD_LIB_PATH.iterdir()}

            ast = ast.parse('''
            ${notebook_content }
            ''')

            visitor = invectio.lib.InvectioVisitor()
            visitor.visit(ast)

            report = visitor.get_module_report()

            libs = filter(
                lambda k: k not in _STD_LIB | set(sys.builtin_module_names), report
            )
            list(libs)
        `)

        const callback = ( msg: io.Message ) => {
            console.debug( "Execution callback: ", msg )
            if ( msg.msg_type == "error" ) {
                reject( `ERROR: ${ msg.content.ename }: ${ msg.content.evalue }` )
                return
            }

            const result: string = msg.content.data[ "text/plain" ].replace( /\'/g, '"' )
            const requirements: string[] = JSON.parse( result )

            resolve( requirements )
        }

        await execute_python_script( script, { iopub: { output: callback } } )
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
        await Pipfile.create( requirements, true )

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

        let callback = ( msg: io.Message ) => {
            console.debug( "Execution callback: ", msg )

            if ( msg.msg_type == "error" ) {
                reject( new Error( `${ msg.content.ename }: ${ msg.content.evalue }` ) )
                return
            }
            if ( msg.msg_type == "stream" ) {  // adviser / pipenv log messages
                console.info( `[Thamos]: `, msg.content.text )
                return
            }

            if ( msg.msg_type == "execute_result" ) {
                clearTimeout( timeout )

                const result = msg.content.data[ "text/plain" ].replace( /(^')|('$)/g, "" )
                const requirements_locked: RequirementsLocked = RequirementsLockedProxy.Parse( result )

                if ( sync ) {
                    // sync requirements locked with Pipfile.lock
                    set_requirements_locked( Jupyter.notebook, requirements_locked )
                    console.log( "Locked requirements have been synced with Pipfile." )
                }

                resolve( requirements_locked )
            }
            else
                reject( new Error( `Unknown message type: ${ msg.msg_type }` ) )
        }

        await execute_python_script( command, { iopub: { output: callback } } )
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
        let iopub_callback = ( msg: io.Message ) => {
            console.debug( "Execution logging callback: ", msg )

            if ( msg.msg_type == "error" ) {
                reject( new Error( `${ msg.content.ename }: ${ msg.content.evalue }` ) )
            }

            else if ( msg.msg_type == "stream" ) {  // adviser / pipenv log messages
                const stream = msg.content.name || "stdout"
                const text = utils.parse_console_output( msg.content.text )

                if ( stream === "stderr" ) {
                    console.warn( `[pipenv]: `, text )
                } else
                    console.log( `[pipenv]: `, text )

            }
        }

        /**
         * Execution done callback
         */
        let shell_callback = ( msg: io.Message ) => {
            console.debug( "Execution shell callback: ", msg )

            if ( msg.content.status == "error" ) {
                reject( new Error( `${ msg.content.ename }: ${ msg.content.evalue }` ) )
            }

            console.log( "Requirements have been successfully installed" )

            resolve()
        }


        let opts = ""

        if ( dev_packages ) opts += "--dev "
        if ( pre_releases ) opts += "--pre"

        console.log( "Installing requirements: " )

        await execute_shell_command(
            `pipenv install --ignore-pipfile --keep-outdated ${ opts } ${ requirements }`,
            { iopub: { output: iopub_callback }, shell: { reply: shell_callback } }
        )
    } )
}
