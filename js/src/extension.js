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
window.DEFAULT_RESOLUTION_ENGINE = "thoth"

// Load the extension
if ( window.require ) {
    window.require.config( {
        map: {
            "*": {
                "nbrequirements": "nbextensions/jupyter-nbrequirements/index"
            }
        }
    } );
    window.require( [ 'nbrequirements' ], () => console.log( "Loaded extension: jupyter-nbrequirements" ) )
}

// Export the required load_ipython_extension
module.exports = {
    load_ipython_extension: function () {// Autoload
        // wait for both the kernel and the jupyter-require extension to be loaded
        window.require( [
            "base/js/namespace",
            "base/js/events"
        ], ( Jupyter, events ) => {
            const options = {
                silent: false,
                // if there is an error, let user try to manually
                // load the extension himself and finish the extension
                // loading anyway
                stop_on_error: true,
                store_history: false
            }

            // Wait for the required extension to be loaded
            events.one( "extension_loaded.JupyterRequire", () => {

                console.info( "Loading magic commands: [ '%dep', '%requirements', '%kernel' ]" )

                const cmd = "%reload_ext " + __extension__
                Jupyter.notebook.kernel.execute( cmd, {}, options )

            } )
        } )
    }
};
