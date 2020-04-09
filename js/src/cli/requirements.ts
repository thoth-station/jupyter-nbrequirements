import _ from "lodash"

import { Logger } from "../config"
import Command, { DefaultArguments } from "./command"

import { execute_python_script } from "../core"
import {
    get_requirements,
    set_requirements,
    get_requirements_locked,
    load_kernel,
    set_kernel
} from "../notebook"
import {
    Pipfile,
    PipfileLock,
    Source,
    lock_requirements,
    install_requirements,
    install_kernel,
    install_requirements_with_pip,
} from "../thoth"

import * as utils from "../utils"

import * as io from "../types/io"
import { Requirements, SourcesEntity, ResolutionEngine, RequirementsLocked } from "../types/requirements"
import { get_python_version } from "../notebook"
import { lock_requirements_with_pipenv } from "../thoth"

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require( "base/js/namespace" )
import { store } from "../ui"

declare const DEFAULT_RESOLUTION_ENGINE: ResolutionEngine


export class Help extends Command {
    public readonly message: string

    constructor( cmd?: string ) {
        super()

        if ( cmd )
            this.message = `Unknown command '${ cmd }'. See --help for more info.`
        else
            this.message = "Provide a valid JS command. See --help for more info."
    }

    public async run( args: any, element: HTMLDivElement ) {
        // Append to the cell output
        utils.display( this.message, element )
    }
}

export class Clear extends Command {

    /**
     * Clear notebook requirements and locked requirements metadata.
     *
     * @memberof Clear
     */
    public async run() {
        delete Jupyter.notebook.metadata.requirements
        delete Jupyter.notebook.metadata.requirements_locked

        store.dispatch( "clear" )
    }
}

namespace Ensure {// eslint-disable-line

    export interface Arguments extends DefaultArguments {
        // Resolution engine: {thoth, pipenv} (defaults to thoth)
        engine: ResolutionEngine
        // Only applicable if engine == 'pipenv'
        dev_packages?: boolean,
        // Only applicable if engine == 'pipenv'
        pre_releases?: boolean,
        // Skip installation of the Jupyter kernel.
        skip_kernel: boolean
        // [optional] Kernel name, otherwise use notebook name.
        name: string
    }

}
export class Ensure extends Command {

    /**
     * Ensure gets a project into a complete, reproducible, and likely compilable state.
     *
     * @param {Ensure.Arguments} args
     * @returns {Promise<void>}
     * @memberof Ensure
     */
    public async run( args: Ensure.Arguments ): Promise<void> {

        // Stage 1: get & set notebook requirements
        // We don't want to ignore the metadata here, the purpose of ensure
        // is to have a working environment, hence we should merge both metadata
        // and notebook requirements
        const requirements: Requirements = await get_requirements( Jupyter.notebook, false )

        Logger.info( "[Ensure] requirements: ", requirements )

        // Stage 2: lock down the dependencies and write them to the Pipfile.lock
        // This command also makes sure that the requirements are written to the Pipfile
        let req_locked: RequirementsLocked

        const engine: ResolutionEngine = args.engine || DEFAULT_RESOLUTION_ENGINE
        switch ( engine ) {
            case "thoth": {
                req_locked = await lock_requirements( requirements, true )
                    .catch( err => { throw err } )

                break
            }

            case "pipenv": {
                // we want Pipfile to be synced with Pipfile.lock, always overwrite
                await Pipfile.create( { requirements, overwrite: true, sync: true } )

                req_locked = await lock_requirements_with_pipenv(
                    args.dev_packages,
                    args.pre_releases, true
                )
                    .catch( err => { throw err } )

                break
            }

            case "micropipenv": {
                // we want Pipfile to be synced with Pipfile.lock, always overwrite
                await Pipfile.create( { requirements, overwrite: true, sync: true } )

                req_locked = await get_requirements_locked(
                    Jupyter.notebook,
                    args.ignore_metadata,
                    args.dev_packages,
                    args.pre_releases,
                    true,
                    "micropipenv"
                )
                    .catch( err => { throw err } )

                break
            }

            default: throw new Error( `Unknown resolution engine: ${ engine }` )
        }

        Logger.info( "[Ensure] locked requirements: ", req_locked )

        // Stage 3: install the requirements along with the dev packages
        // empty [] makes sure that the requirements are installed from the Pipfile.lock
        await install_requirements( { dev_packages: true } )
            .catch( err => { throw err } )

        // [Optional] Stage 4: install the Jupyter kernel
        if ( args.skip_kernel ) return

        await install_kernel( args.name )
            .then( ( name: string ) => load_kernel( name ) )
            .then( ( name: string ) => set_kernel( name ) )
            .then( ( name: string ) => Logger.info( "[Ensure] Successfully set Kernel: ", name ) )
            .catch( ( err: string | Error ) => {
                throw typeof err === "string" ? new Error( err ) : err
            } )
    }

}

namespace Add {// eslint-disable-line

    export interface Arguments extends DefaultArguments {
        // Package name and alias
        dependency: string
        alias?: string
        // Version constraint
        version: string
        // Index (source name) for this dependency.
        index: string
        // Whether to store the dependency as dev-package.
        dev: boolean
        // Whether to sync notebook metadata with the Pipfile
        sync?: boolean
    }

}
export class Add extends Command {

    /**
     * Add dependency to the notebook metadata without installing it.
     *
     * @param {Add.Arguments} args
     * @returns {Promise<void>}
     * @memberof Add
     */
    public async run( args: Add.Arguments ): Promise<void> {
        this.validate( args )

        let req: Requirements | undefined = Jupyter.notebook.metadata.requirements
        if ( _.isUndefined( req ) ) {
            const python_version = get_python_version( Jupyter.notebook )
            req = {
                aliases: {},
                packages: {},
                requires: { python_version: python_version },
                sources: [ new Source() ],
                "dev-packages": {}
            }
        }

        let spec: string | { version: string, index: string } = args.version

        // resolve index
        if ( args.index !== "pypi" ) {
            // check if the source exists
            if ( req.sources == null )
                throw Error( `Missing index: ${ args.index }` )

            const indices: string[] = Array.from( req.sources ).map( ( source: SourcesEntity ) => source.name )
            if ( !_.includes( indices, args.index ) )
                throw Error( `Missing index: ${ args.index }` )

            spec = { version: args.version, index: args.index }
        }

        if ( args.alias ) req.aliases[ args.alias ] = args.dependency

        // resolve development package
        if ( args.dev )
            req[ "dev-packages" ] = _.assign( req[ "dev-packages" ] || {}, { [ args.dependency ]: spec } )
        else
            req.packages = _.assign( req.packages || {}, { [ args.dependency ]: spec } )

        set_requirements( Jupyter.notebook, req )

        // resolve sync
        if ( args.sync ) {
            Logger.log( "Updating Pipfile." )
            await Pipfile.create( { requirements: req, overwrite: true } )
                .then( () => {
                    Logger.log( "Pipfile has been successfully updated." )
                } )
                .catch( ( err: string | Error ) => {
                    Logger.error( err )
                    throw typeof err === "string" ? new Error( err ) : err
                } )
        }
    }
}

namespace Get {// eslint-disable-line

    // eslint-disable-next-line
    export interface Arguments extends DefaultArguments { }

}
export class Get extends Command {

    /**
     * Get notebook requirements from the notebook metadata.
     * If the metadata are not set, gather library usage from the notebook.
     *
     * @param {Get.Arguments} args
     * @param {HTMLDivElement} element
     * @returns {Promise<void>}
     * @memberof Get
     */
    public async run( args: Get.Arguments, element: HTMLDivElement ): Promise<void> {
        this.validate( args )
        const req = await get_requirements( Jupyter.notebook, args.ignore_metadata )

        if ( args.to_json ) {
            // Append to the cell output
            utils.display( req, element )
        }
        else if ( args.to_file ) {// Create the Pipfile in the current repository
            return await Pipfile.create( { requirements: req, overwrite: args.overwrite } )
                .then( () => {
                    Logger.log( "Pipfile has been successfully created." )
                } )
                .catch( ( err: string | Error ) => {
                    Logger.error( err )
                } )
        }
        else {// default, display requirements in Pipfile format
            const json = JSON.stringify( req )
            // TODO: Turn this into a template
            await execute_python_script(
                utils.dedent( `\n                    from thoth.python import Pipfile\n                    print(\n                        Pipfile.from_dict(json.loads('${ json }')).to_string()\n                    )` )
            )
        }
    }
}

namespace Remove {
    export interface Arguments extends DefaultArguments {
        dependency: string
    }
}
export class Remove extends Command {

    /**
     * Remove a notebook dependency
     *
     * @param {Remove.Arguments} args
     * @returns {Promise<void>}
     * @memberof Remove
     */
    public async run( args: Remove.Arguments ) {
        const req: Requirements | undefined = Jupyter.notebook.metadata.requirements
        if ( _.isUndefined( req ) ) {
            Logger.info( "Notebook requirements are empty. Nothing to remove." )
            return
        }

        const pkg: string = args.dependency
        for ( const attr of [ "packages", "dev-packages" ] ) {
            const obj: any = _.get( req, attr )

            if ( _.has( obj, pkg ) ) {
                const updated = _.omit( obj, pkg )
                _.set( req, attr, updated )

                Logger.info( `Removed dependency ${ pkg } from ${ attr }` )
            }
        }

        for ( const [ alias, original ] of Object.entries( req.aliases ) ) {
            if ( original === pkg ) {
                req.aliases = _.omit( req.aliases, alias )
                break
            }
        }

        return set_requirements( Jupyter.notebook, req as Requirements )
    }
}

namespace Set {// eslint-disable-line

    export interface Arguments extends DefaultArguments {
        requirements: Requirements
    }

}
export class Set extends Command {

    /**
     * Set notebook requirements.
     * If `to_file` argument is provided, writes them to the Pipfile.
     *
     * @param {Set.Arguments} args
     * @memberof Set
     */
    public async run( args: Set.Arguments ) {
        const req: Requirements = args.requirements

        set_requirements( Jupyter.notebook, req )
    }
}

namespace Lock {// eslint-disable-line

    export interface Arguments extends DefaultArguments {
        // Whether to sync notebook metadata with the Pipfile.lock
        sync: boolean
        // Resolution engine: {thoth, pipenv} (defaults to thoth)
        engine: ResolutionEngine
        // Only applicable if engine == 'pipenv'
        dev_packages?: boolean,
        // Only applicable if engine == 'pipenv'
        pre_releases?: boolean,
    }

}
export class Lock extends Command {

    /**
     * Lock notebook requirements.
     * If `to_file` argument is provided, writes them to the Pipfile.lock.
     *
     * @param {Lock.Arguments} args
     * @param {HTMLDivElement} element
     * @returns {Promise<void>}
     * @memberof Lock
     */
    public async run( args: Lock.Arguments, element?: HTMLDivElement ): Promise<void> {
        args.engine = args.engine || DEFAULT_RESOLUTION_ENGINE
        if ( args.engine === "pipenv" ) {
            args.dev_packages = args.dev_packages || false
            args.pre_releases = args.pre_releases || false
        }

        await get_requirements_locked(
            Jupyter.notebook,
            args.ignore_metadata,
            args.sync,
            args.dev_packages,
            args.pre_releases,
            args.engine
        )
            .then( async ( req_locked: RequirementsLocked ) => {
                if ( args.to_file ) {
                    return await PipfileLock.create( { requirements_locked: req_locked } )
                        .then( () => {
                            Logger.log( "Pipfile.lock has been successfully created." )
                        } )
                        .catch( ( err ) => {
                            Logger.error( "Failed to lock down dependencies.\n", err )
                        } )
                }

                // default, display requirements in Pipfile.lock format
                if ( !_.isUndefined( element ) ) utils.display( req_locked, element )
            } )
            .catch( ( err: string ) => {
                Logger.error( "Failed to lock requirements.\n", err )
                throw new Error( err )
            } )
    }
}

namespace Install {// eslint-disable-line

    export interface Arguments extends DefaultArguments {
        requirements: string[]
    }

}
export class Install extends Command {

    /**
     * Install notebook requirements to a virtual environment.
     * If no such virtual environment exists, create it first.
     *
     * @param {Install.Arguments} args
     * @returns {Promise<void>}
     * @memberof Install
     */
    public async run( args: Install.Arguments ): Promise<void> {
        await install_requirements_with_pip(
            args.requirements
        )
    }
}

namespace Kernel {// eslint-disable-line

    type KernelCommand = "info" | "install" | "set"

    export interface Arguments extends DefaultArguments {
        command: KernelCommand
        name: string
    }

}
export class Kernel extends Command {

    /**
     * Create and/or set a new Jupyter kernel.
     *
     * @param {Kernel.Arguments} args
     * @param {HTMLDivElement} element
     * @returns {Promise<void>}
     * @memberof Kernel
     */
    public async run( args: Kernel.Arguments, element: HTMLDivElement ): Promise<void> {
        const kernel = Jupyter.notebook.kernel

        if ( args.command === "install" ) {
            install_kernel( args.name )
                .then( ( name: string ) => load_kernel( name ) )
                .then( ( name: string ) => Logger.log( `Kernel spec '${ name }' is ready.` ) )
                .catch( ( err: Error ) => { throw err } )
        }
        else if ( args.command === "set" ) {
            set_kernel( args.name )
                .then( ( name: string ) => Logger.log( `Kernel '${ name }' has been set.` ) )
                .catch( ( err: Error ) => { throw err } )
        }
        else {// display kernel info and exit
            kernel.kernel_info( ( msg: io.Message ) => {
                const content = Object.entries( _.omit( msg.content, [ "banner", "help_links" ] ) ).sort()
                const kernel_info = {
                    name: Jupyter.notebook.kernel.name,
                    ..._.fromPairs( content )
                }

                utils.display( kernel_info, element )
            } )
        }
    }
}
