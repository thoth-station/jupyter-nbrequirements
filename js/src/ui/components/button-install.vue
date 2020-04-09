<template>
    <section>
        <div class="columns is-centered">
            <b-button class="is-primary is-large" style="margin-top: 20px;" icon-left="download-multiple"
                size="is-medium" :loading="isInstalling" @click="onInstall">Install</b-button>
        </div>
    </section>
</template>

<script lang="ts">
    import _ from "lodash";

    import { Logger } from "../../config";

    import Vue from "vue";
    import { mapState } from "vuex";

    import Component from "vue-class-component";
    import { install_requirements, Pipfile } from "../../thoth";
    import { Lock } from "../../cli/requirements";

    import { ResolutionEngine } from "../../types";

    import { ToastProgrammatic as Toast } from "buefy";

    declare const DEFAULT_RESOLUTION_ENGINE: ResolutionEngine;

    @Component( {
        filters: {
            /**
             * Filter to truncate string, accepts a length parameter
             */
            truncate( value: string, length: number ) {
                if ( _.isUndefined( value ) ) {
                    return "";
                }
                return value.length > length
                    ? value.substr( 0, length ) + "..."
                    : value;
            }
        },
        computed: mapState( [ "data", "loading" ] )
    } )
    export default class InstallButton extends Vue {
        data!: any[]; // TODO: PyPI interface
        loading!: boolean;

        _installArguments: string[] = [];

        get installArguments(): string[] {
            return this._installArguments;
        }

        set installArguments( val: string[] ) {
            this._installArguments = val;
        }

        get isInstalling(): boolean {
            return this.$store.state.status.current == "installation";
        }

        get isSwitchedDev(): boolean {
            return _.includes( this.installArguments, "--dev" );
        }

        get isSwitchedPre(): boolean {
            return _.includes( this.installArguments, "--pre" );
        }

        async onInstall() {
            this.$store.commit( "status", {
                cmd: install_requirements,
                current: "installation"
            } );

            try {
                await Pipfile.create( {
                    requirements: this.$store.state.requirements,
                    overwrite: true,
                    sync: true
                } );

                const cmd = new Lock();
                await cmd.run( {
                    sync: true,
                    engine: DEFAULT_RESOLUTION_ENGINE,
                    dev_packages: this.isSwitchedDev,
                    pre_releases: this.isSwitchedPre
                } );

                install_requirements( [], {
                    dev_packages: this.isSwitchedDev,
                } )
                    .then( () => {
                        this.$buefy.snackbar.open( {
                            container: "#nbrequirements-notification-container",
                            message: "Requirements successfully installed.",
                            position: "is-bottom",
                            type: "is-success"
                        } );
                        this.$store.dispatch( "sync" );
                    } )
                    .catch( err => {
                        throw err;
                    } );
            } catch ( err ) {
                Logger.error( err );

                this.$buefy.snackbar.open( {
                    container: "#nbrequirements-notification-container",
                    message: "An error occurred while installing requirements.",
                    position: "is-bottom",
                    type: "is-danger"
                } );

                this.$store.commit( "status", {
                    cmd: this.onInstall,
                    err: err,
                    current: "failed"
                } );
            }
        }
    }
</script>