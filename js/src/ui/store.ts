import axios from "axios"

import Vue from "vue"
import Vuex from "vuex"


import { Add, Set } from "../cli/requirements"
import { Requirements } from "../types/requirements"
import { PackageVersion } from "../thoth"

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require( "base/js/namespace" )


Vue.use( Vuex )

export default new Vuex.Store( {

    state: {
        // Package data gathered from PyPI
        // TODO: Create PyPI interface
        data: Array<any>( [] ),

        loading: false,

        requirements: Jupyter.notebook.metadata.requirements,
        selectedPackages: [],
    },
    mutations: {
        sync( state ) {
            state.requirements = Jupyter.notebook.metadata.requirements
        },
        sortData( state, { field, order }: { field: string, order: "ascending" | "descending" } ) {
            // sort data in place
            state.data.sort( ( a: any, b: any ) => {
                let ret: number

                if ( a[ field ] < b[ field ] ) ret = -1
                else if ( a[ field ] > b[ field ] ) ret = 1
                else ret = 0

                return ret * ( order === "descending" ? -1 : 1 )

            } )
        }
    },
    actions: {
        addRequirement( { commit, dispatch }, dep: PackageVersion ) {
            const cmd = new Add()
            cmd.run( {
                dev: dep.develop,
                index: "pypi",
                dependency: dep.name,
                version: dep.version,
            } ).then( () => {
                commit( "sync" ); dispatch( "loadData" )
            } )
        },
        setRequirements( { commit, dispatch }, req: Requirements ) {
            const cmd = new Set()
            cmd.run( {
                requirements: req
            } ).then( () => {
                commit( "sync" ); dispatch( "loadData" )
            } )
        },

        /*
         * Load async data
         */
        async loadData( { state } ) {
            state.loading = true
            state.data = []

            const requirements: Requirements = state.requirements

            const data: any[] = []
            for ( const [ pkg, v ] of Object.entries( requirements.packages ) ) {
                // get info about the package from PyPI
                let item: {
                    package_name: string
                    constraint: string
                    release: string
                    summary: string
                    score: string
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
                            package_name: pkg,
                            constraint: version as string,
                            release: package_data.info.version,
                            summary: package_data.info.summary,
                            score: ( Math.random() * 10 ).toPrecision( 2 ) // TODO
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
    }

} )