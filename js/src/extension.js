/**
 * Jupyter NBRequirements.
 *
 * This file contains the javascript that is run when the notebook is loaded.
 * It contains some requirejs configuration and the `load_ipython_extension`
 * which is required for any notebook extension.
 *
 * @link   https://github.com/CermakM/jupyter-nbrequirements#readme
 * @file   This file loads the Jupyter magic extension for managing notebook requirements.
 * @author Marek Cermak <macermak@redhat.com>
 * @since  0.0.1
 */

/* eslint-disable */

const __extension__ = "jupyter_nbrequirements"

// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.
__webpack_public_path__ = document.querySelector( "body" ).getAttribute( 'data-base-url' ) + 'nbextensions/jupyter-nbrequirements/';

/** Constants **/
// Logging level
window.DEFAULT_LOGGING_LEVEL = { value: 2, name: "DEBUG" }
// Notification timeout in ms
window.DEFAULT_NOTIFICATION_TIMEOUT = 30000
// Resolution engine {pipenv, thoth}
window.DEFAULT_RESOLUTION_ENGINE = "pipenv"

// Load the extension
if ( window.require ) {
    window.require.config( {
        map: {
            "*": {
                "nbrequirements": "nbextensions/jupyter-nbrequirements/index"
            }
        }
    } );
}

// Export the required load_ipython_extension
module.exports = {
    load_ipython_extension: function () {// Autoload
        // wait for both the kernel and the jupyter-require extension to be loaded
        window.require( [
            "underscore",
            "base/js/namespace",
            "base/js/events",
        ], ( _, Jupyter, events ) => {
            const options = {
                silent: false,
                // if there is an error, let user try to manually
                // load the extension himself and finish the extension
                // loading anyway
                stop_on_error: true,
                store_history: false
            }

            // Wait for the required extension to be loaded
            events.on( "extension_loaded.JupyterRequire", () => {
                window.require( [ 'nbrequirements' ], ( { version } ) => {
                    console.info( "Loading magic commands: [ '%dep', '%requirements', '%kernel' ]" )

                    const cmd = "%reload_ext " + __extension__
                    Jupyter.notebook.kernel.execute( cmd, {}, options )

                    console.log( "Loaded extension: jupyter-nbrequirements", version )
                } )
            } )

            // Prepare the notebook if necessary
            events.on( "mounted.NBRequirementsUI", async ( e, { vm, store } ) => {
                const { cli, Logger } = window.require( 'nbrequirements' )

                Logger.debug( "Checking whether auto-installation is turned on." )

                const metadata = Jupyter.notebook.metadata
                if ( _.has( metadata, "requirements" ) && metadata.requirements.autoinstall ) {
                    // TODO: Check whether the requirements need to be installed

                    Logger.info( "Attempting to automatically install dependencies." )

                    vm.$buefy.snackbar.open( {
                        container: "#nbrequirements-notification-container",
                        message: "Preparing environment.",
                        position: "is-bottom",
                        type: "is-info"
                    } );

                    store.commit( "status", {
                        cmd: this,
                        current: "installation"
                    } )

                    // TODO: decide how to proceed with `skip_kernel` argument
                    await cli( "ensure", { skip_kernel: false } )
                        .then( () => {
                            store.commit( "ready" )

                            vm.$buefy.snackbar.open( {
                                container: "#nbrequirements-notification-container",
                                message: "Environment has been successfully prepared.",
                                position: "is-bottom",
                                type: "is-success"
                            } );

                            metadata.requirements.autoinstall = false
                        } )
                        .catch( ( err ) => {
                            Logger.error( "Unable to automatically install requirements: ", err )
                        } )
                } else {
                    Logger.info( "Auto-installation of requirements is turned off." )
                }

                Logger.info( "The notebook is ready." )
            } )
        } )
    }
};
