/**
 * Notebook.
 *
 * Manage state of the notebook.
 *
 * @link   https://github.com/CermakM/jupyter-nbrequirements#readme
 * @file   This file implements functionality to manage the notebook state.
 * @author Marek Cermak <macermak@redhat.com>
 * @since  0.0.1
 */

import _ from 'lodash'

import { Requirements, RequirementsLocked } from './types/requirements';

import { KernelInfo, KernelInfoProxy } from './kernel';
import { gather_library_usage, lock_requirements } from './thoth'
import { PackageVersion, Source } from './thoth'

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require( "base/js/namespace" )

// Hang the functions on Jupyter.Notebook prototype for easier usage
Jupyter.Notebook.prototype.set_requirements = _.partial( set_requirements, Jupyter.notebook )
Jupyter.Notebook.prototype.get_requirements = _.partial( get_requirements, Jupyter.notebook )

Jupyter.Notebook.prototype.set_requirements_locked = _.partial( set_requirements_locked, Jupyter.notebook )
Jupyter.Notebook.prototype.get_requirements_locked = _.partial( get_requirements_locked, Jupyter.notebook )

Jupyter.Notebook.prototype.get_kernel_info = _.partial( get_kernel_info, Jupyter.notebook )


export function set_requirements( notebook: Jupyter.Notebook, requirements: Requirements ): void {
    let metadata = notebook.metadata

    if ( _.isUndefined( metadata.requirements ) ) {
        metadata.requirements = requirements
    } else {
        console.debug( "Notebook requirements already exist. Updating." )
        // update the notebook metadata
        _.assign( metadata.requirements, requirements )
    }

    console.log( "Notebook requirements have been set successfully." )
}

export function get_requirements( notebook: Jupyter.Notebook, ignore_metadata: boolean = false ): Promise<Requirements> {
    return new Promise( async ( resolve ) => {
        console.log( "Reading notebook requirements." )

        let requirements: Requirements | undefined = notebook.metadata.requirements
        if ( _.isUndefined( requirements ) || ignore_metadata ) {
            console.log( "Requirements are not defined. Gathering." )
            requirements = await gather_library_usage()
                .then( ( req: string[] ) => {
                    const python_packages: { [ name: string ]: any } = {}
                    req.forEach( ( p: string ) => {
                        const python_package_name = p.toLocaleLowerCase()
                        const python_package = new PackageVersion( python_package_name )

                        _.assign(
                            python_packages,
                            python_package.get_pipfile_entry()
                        )
                    } )

                    const kernel_info: KernelInfo = get_kernel_info( notebook )

                    const python_version: string = kernel_info.language_info.version
                    const match = python_version.match( /\d.\d/ )
                    if ( match == null ) {
                        throw Error( `Python version '${ match }' does not match required pattern.` )
                    }
                    const requires = { python_version: match[ 0 ] }

                    return {
                        packages: python_packages,
                        requires: requires,
                        sources: [
                            new Source()
                        ]
                    } as Requirements
                } )
                .catch( ( err: Error ) => {
                    console.error( err )
                    throw err
                } )

            resolve( requirements )
        } else {
            // Resolve with the metadata otherwise
            resolve( requirements )
        }
    } )
}


export function set_requirements_locked( notebook: Jupyter.Notebook, requirements_locked: RequirementsLocked ) {
    const metadata: any = notebook.metadata

    if ( _.isUndefined( metadata.requirements_locked ) ) {
        metadata.requirements_locked = requirements_locked
    } else {
        console.debug( "requirements_locked already exist. Updating." )
        // update the notebook metadata
        _.assign( metadata.requirements_locked, requirements_locked )
    }

    console.log( "Notebook locked requirements have been set successfully." )
}

export function get_requirements_locked( notebook: Jupyter.Notebook, ignore_metadata = false, sync = true ): Promise<RequirementsLocked> {
    return new Promise( async ( resolve, reject ) => {
        console.log( "Reading notebook locked requirements." )

        const requirements_locked: RequirementsLocked | undefined = notebook.metadata.requirements_locked
        if ( _.isUndefined( requirements_locked ) || ignore_metadata ) {
            console.log( "Locked requirements are not defined." )

            lock_requirements( undefined, sync )
                .then( ( req_locked: RequirementsLocked ) => {
                    console.log( "Successfully locked notebook requirements.", req_locked )

                    resolve( req_locked )
                } )
                .catch( ( err: string ) => reject( new Error( err ) ) )
        } else {
            resolve( requirements_locked )
        }
    } )
}

function get_kernel_info( notebook: Jupyter.Notebook ): KernelInfo {
    const json: string = JSON.stringify( notebook.kernel.info_reply )
    if ( _.isUndefined( json ) ) {
        throw Error( 'Unable to retrieve Kernel info' )
    }

    // Parse and perform type check
    const info: KernelInfo = KernelInfoProxy.Parse( json )

    return info
}
