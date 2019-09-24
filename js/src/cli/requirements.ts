import _ from "lodash";

import Command from './command'

import { execute_python_script } from '../core'
import {
    get_requirements,
    set_requirements,
    get_requirements_locked
} from '../notebook'
import {
    Pipfile,
    PipfileLock,
    install_requirements,
    install_kernel,
    load_kernel,
    set_kernel
} from '../thoth'

import * as utils from '../utils'

import * as io from '../types/io'
import { Requirements } from '../types/requirements'

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require( "base/js/namespace" )


export class Help extends Command {
    public readonly message: string

    constructor( cmd?: string ) {
        super()

        if ( cmd )
            this.message = `Unknown command '${ cmd }'. See --help for more info.`
        else
            this.message = "Provide a valid JS command. See --help for more info."
    }

    public run( args: any, element: HTMLDivElement ): void {
        // Append to the cell output
        utils.display( this.message, element )
    }
}


export class Get extends Command {

    public async run( args: any, element: HTMLDivElement ): Promise<void> {
        this.validate( args )
        try {
            let req = await get_requirements( Jupyter.notebook, args.ignore_metadata )
            if ( args.to_json ) {
                // Append to the cell output
                utils.display( req, element )
            }
            else if ( args.to_file ) {// Create the Pipfile in the current repository
                return await Pipfile.create( req )
                    .then( () => {
                        console.log( "Pipfile has been sucessfully created." )
                    } )
                    .catch( ( err: string | Error ) => {
                        console.error( err )
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
        catch ( err ) {
            console.error( "Failed to get requirements.\n", err )
        }
    }
}

export class Set extends Command {

    public run( args: any ): void {
        const req: Requirements = args.requirements

        set_requirements( Jupyter.notebook, req )
    }
}

export class Lock extends Command {

    public async run( args: any, element: HTMLDivElement ): Promise<void> {
        get_requirements_locked( Jupyter.notebook, args.ignore_metadata, args.sync )
            .then( async ( req_locked ) => {
                if ( args.to_file ) {
                    return await PipfileLock.create( req_locked )
                        .then( () => {
                            console.log( "Pipfile.lock has been successfully created." )
                        } )
                        .catch( ( err ) => {
                            console.error( "Failed to lock down dependencies.\n", err )
                        } )
                }

                // default, display requirements in Pipfile.lock format
                utils.display( req_locked, element )
            } )
            .catch( ( err ) => {
                console.error( "Failed to lock requirements.\n", err )
            } )
    }
}

export class Install extends Command {

    public async run( args: any ): Promise<void> {
        await install_requirements( args.requirements, args.dev, args.pre )
    }
}

export class Kernel extends Command {

    public async run( args: any, element: HTMLDivElement ): Promise<void> {
        const kernel = Jupyter.notebook.kernel

        if ( args.sub_command === "install" ) {
            install_kernel( args.name )
                .then( ( name: string ) => load_kernel( name ) )
                .then( ( name: string ) => console.log( `Kernel spec '${ name }' is ready.` ) )
        }
        else if ( args.sub_command === "set" ) {
            console.log( `Setting kernel '${ name }'` )

            set_kernel( args.name )
                .then( ( name: string ) => console.log( `Kernel '${ name }' has been set.` ) )
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