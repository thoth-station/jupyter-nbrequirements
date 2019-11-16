import _ from "lodash"
import axios from "axios"

import Vue from "vue"
import Vuex from "vuex"


import * as command from "../cli/requirements"
import { Requirements } from "../types/requirements"
import { PackageVersion } from "../thoth"

import { UserWarning } from "../types/ui"

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require( "base/js/namespace" )

interface ExecutionStatus {
    cmd?: ( ...args: any[] ) => any | string
    err?: Error
    msg?: string

    current: "ready" | "installation" | "success" | "failed"
}


Vue.use( Vuex )

export default new Vuex.Store( {

    state: {
        // Package data gathered from PyPI
        // TODO: Create PyPI interface
        data: Array<any>(),

        editing: false,
        loading: false,

        requirements: Jupyter.notebook.metadata.requirements,

        selectedPackages: [],

        status: {},
        warnings: Array<UserWarning>(),
    },

    getters: {
        data: state => state.data,
        requirements: state => state.requirements
    },

    mutations: {

        /* Data operations */

        push( state, row: any ) {
            state.data.push( row )
        },

        pop( state ) {
            state.data.pop()
        },

        remove( state, row: any ) {
            const idx = state.data.indexOf( row )
            delete state.data[ idx ]
        },

        removeByIndex( state, index: number ) {
            delete state.data[ index ]
        },

        sortData( state, { field, order }: { field: string, order: "asc" | "desc" } ) {
            // sort data in place
            state.data.sort( ( a: any, b: any ) => {
                let ret: number

                if ( a[ field ] < b[ field ] ) ret = -1
                else if ( a[ field ] > b[ field ] ) ret = 1
                else ret = 0

                return ret * ( order === "desc" ? -1 : 1 )

            } )
        },

        /* States */

        editing( state, on: boolean ): void {
            state.editing = on
            if ( on )
                state.status = { current: "editing" }
            else {
                state.status = { current: "ready" }
            }
        },

        loading( state, on: boolean ): void {
            state.loading = on
            if ( on )
                state.status = { current: "loading" }
            else {
                state.status = { current: "ready" }
            }
        },

        ready( state ): void { state.status = { current: "ready" } },

        status( state, status: ExecutionStatus ): void {
            if ( _.isUndefined( status ) )
                throw new Error( "Store received status of type 'undefined'" )

            state.status = status
        }
    },

    actions: {
        sync( { state, dispatch } ) {
            state.requirements = Jupyter.notebook.metadata.requirements
            dispatch( "loadData" )
        },

        /*
         * Load async data
         */
        async loadData( { state } ) {
            state.loading = true
            state.data = []

            const requirements: Requirements = state.requirements
            if ( _.isUndefined( requirements ) ) {
                state.data = []
                state.loading = false

                return
            }

            const data: any[] = []
            for ( const [ pkg, v ] of Object.entries( requirements.packages ) ) {
                // get info about the package from PyPI
                let item: {
                    constraint: string
                    health: string
                    locked: boolean
                    package_name: string
                    releases: string
                    summary: string
                    latest: string
                }

                await axios
                    .get( `https://pypi.org/pypi/${ pkg }/json` )
                    .then( response => {
                        const package_data = response.data

                        let version = v
                        if ( typeof v !== "string" ) {
                            version = v.version
                        }
                        item = {
                            constraint: version as string,
                            health: ( Math.random() * 10 ).toPrecision( 2 ), // TODO
                            latest: package_data.info.version,
                            locked: true,
                            package_name: pkg,
                            summary: package_data.info.summary,
                            releases: package_data.releases,
                        }
                        data.push( item )
                    } )
                    .catch( ( err: Error ) => {
                        state.data = []
                        throw err
                    } )
            }

            setTimeout( () => {
                // Timeout to avoid blink-loading
                state.data = data
                state.loading = false
            }, 1000 )
        },

        addRequirement( { dispatch }, dep: PackageVersion ) {
            const cmd = new command.Add()
            cmd.run( {
                dev: dep.develop,
                index: "pypi",
                dependency: dep.name,
                version: dep.version,
            } )
                .then( () => dispatch( "sync" ) )
        },

        removeRequirement( { dispatch }, name: string ) {
            const cmd = new command.Remove()
            cmd.run( {
                dependency: name
            } )
                .then( () => dispatch( "sync" ) )
        },

        updateRequirement( { dispatch }, dep: PackageVersion ) {
            // alias to add (performs check for an existing package)
            dispatch( "addRequirement", dep )
        },

        setRequirements( { dispatch }, req: Requirements ) {
            const cmd = new command.Set()
            cmd.run( {
                requirements: req
            } )
                .then( () => dispatch( "sync" ) )
        },
    }

} )