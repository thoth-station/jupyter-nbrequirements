import _ from "lodash"
import axios from "axios"

import Vue from "vue"
import Vuex from "vuex"


import * as command from "../cli/requirements"
import { Requirements } from "../types/requirements"
import { PackageVersion } from "../thoth"

import { UserWarning } from "../types/ui"

Vue.use( Vuex )

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require( "base/js/namespace" )

interface ExecutionStatus {
    cmd?: ( ...args: any[] ) => any | string
    err?: Error
    msg?: string

    current: "ready" | "installation" | "success" | "failed"
}

export class PackageData {
    public constraint: string = "*"
    public package_data: any
    public repo_data: any

    public locked: boolean = true

    public constructor(
        public readonly package_name?: string,
        data?: {
            constraint?: string,
            locked?: boolean,
            package_name: string,
            package_data: any,
            repo_data?: any,
        } ) {

        Object.assign( this, data )
    }

    public get health(): number | null {
        if ( !this.stars ) return null

        // This should really be more sophisticated
        if ( this.stars > 5000 ) return 0.8
        if ( this.stars > 1000 ) return 0.6
        if ( this.stars > 100 ) return 0.4
        if ( this.stars > 10 ) return 0.2

        return 1
    }

    public get latest(): string { return this.package_data.info.version }

    public get releases(): any[] {
        return this.package_data.releases
    }

    public get stars(): number | null {
        if ( !this.repo_data )
            return null

        return this.repo_data.stargazers_count
    }

    public get summary(): string { return this.package_data.info.summary }
}

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
                let item: PackageData

                await axios
                    .get( `https://pypi.org/pypi/${ pkg }/json` )
                    .then( async response => {
                        const package_data = response.data
                        const package_urls: { [ k: string ]: string } | null = package_data.info.project_urls

                        let repo_data = {}
                        if ( package_urls !== null ) {
                            const github_url = Object.values( package_urls )
                                .filter( ( url: string ) => url.match( /github.com/ ) )
                            if ( github_url ) {
                                const m = github_url[ 0 ].match( /github.com\/(.*?)\// )
                                if ( m && m[ 1 ].length > 0 ) {
                                    const owner = m[ 1 ]
                                    const api_url = `https://api.github.com/repos/${ owner }/${ pkg }`

                                    repo_data = await axios.get( api_url )
                                        .then( resp => resp.data )
                                        .catch( () => { } )
                                }
                            }
                        }

                        let version = v
                        if ( typeof v !== "string" ) {
                            version = v ? v.version : "*"
                        }

                        item = new PackageData( pkg, {
                            constraint: version as string,
                            locked: true,
                            package_data: package_data,
                            package_name: pkg,
                            repo_data: repo_data
                        } )
                        data.push( item )
                    } )
                    .catch( ( err: Error ) => {
                        state.data = []
                        state.loading = false
                        state.warnings.push( {
                            "context": this,
                            "level": "danger",
                            "msg": err.message
                        } )
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