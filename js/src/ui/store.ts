import _ from "lodash"
import axios from "axios"

import Vue from "vue"
import Vuex from "vuex"


import * as command from "../cli/requirements"
import { Requirements } from "../types/requirements"
import { PackageVersion, get_installed_packages } from "../thoth"

import { newNotification, Notification } from "./notify"
import Logger from "js-logger"

Vue.use( Vuex )

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require( "base/js/namespace" )
// @ts-ignore
import events = require( "base/js/events" )
import { ToastProgrammatic } from "buefy"

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
    public version: string | null = null

    public constructor(
        public readonly package_name?: string,
        data?: {
            constraint?: string,
            locked?: boolean,
            package_name: string,
            package_data: any,
            repo_data?: any,
            version?: string
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

    public get installed(): boolean { return this.version !== undefined }

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
        data: Array<PackageData>(),

        editing: false,
        loading: false,

        requirements: Jupyter.notebook.metadata.requirements,

        selectedPackages: [],
        installedPackages: {},

        status: {},
        notifications: Array<Notification>(),
    },

    getters: {
        data: state => state.data,
        requirements: state => state.requirements,
        installedPackages: state => state.installedPackages
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
        async clear( { state, dispatch, commit } ) {
            state.data = []
            state.requirements = []

            delete Jupyter.notebook.metadata.requirements
            delete Jupyter.notebook.metadata.requirements_locked

            state.notifications = Array<Notification>()

            const n: Notification = newNotification(
                {
                    message: "Requirements have been cleared successfully",
                    type: "is-info",
                }, "toast", null
            )
            ToastProgrammatic.open( n )

            commit( "ready" )
        },

        async sync( { state, dispatch, commit } ) {
            events.trigger( "before_sync.NBRequirements", this )

            // clear warnings before syncing
            // if the problems persist, the warnings will be produced again
            state.notifications = Array<Notification>()

            // sync the requirements with the data in the UI
            const cmd = new command.Add()
            state.data.map( async ( d ) => {
                await cmd.run( {
                    dev: false,
                    index: "pypi",
                    dependency: d.package_name as string,
                    version: d.constraint || "*",
                } )
            } )
            state.requirements = Jupyter.notebook.metadata.requirements

            await dispatch( "getInstalledPackages" )
                .catch( ( err ) => Logger.error( "Could not sync installed packages.", err ) )
            await dispatch( "loadData" )  // TODO: This should be more intelligent
                .catch( ( err ) => Logger.error( "Could not sync package data.", err ) )

            events.trigger( "after_sync.NBRequirements", this )
            commit( "ready" )
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
            for ( const [ pkg, v ] of Object.entries( requirements.packages || {} ) ) {
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
                            if ( github_url.length != 0 ) {
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
                            repo_data: repo_data,
                            version: _.get( state.installedPackages, pkg ),
                        } )
                        if ( !item.installed ) {
                            const n: Notification = newNotification(
                                {
                                    message: `Package ${ pkg } is required but not installed.`,
                                    type: "is-danger",
                                }, "snackbar", pkg
                            )
                            state.notifications.push( n )
                        }

                        data.push( item )
                    } )
                    .catch( ( err: Error ) => {
                        state.data = []
                        state.loading = false

                        const n: Notification = newNotification(
                            {
                                message: err.message,
                                type: "is-danger",
                            }, "snackbar", this
                        )
                        state.notifications.push( n )

                        throw err
                    } )
            }

            setTimeout( () => {
                // Timeout to avoid blink-loading
                state.data = data
                state.loading = false
            }, 1000 )
        },

        async getInstalledPackages( { state } ) {
            state.installedPackages = {}

            await get_installed_packages()
                .then( ( packages ) => {
                    packages.forEach( p => {
                        // @ts-ignore
                        state.installedPackages[ p.name.toLowerCase() ] = p.version
                    } )
                } )
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