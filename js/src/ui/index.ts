import Vue from "vue"
import Buefy from "buefy"

import { Logger } from "../config"

import store from "./store"

import UI from "./ui.vue"
import VueContainer from "./container"

// Create the UI
Vue.use( Buefy )

customElements.define( "vue-container", VueContainer, { extends: "div" } )


function createNotificationContainer(): Promise<HTMLElement> {
    return new Promise( resolve => {
        Logger.debug( "Creating a new notification container." )

        const container = $( document.createElement( "div", { is: "vue-container" } ) )
            .attr( "id", "nbrequirements-notification-container" )
            .prependTo( "#notebook" )
            .get( 0 )

        $( container ).ready( function () {

            const style = document.createElement( "style" )
            style.textContent = `
                .notices * {
                    font-family: BlinkMacSystemFont,-apple-system,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,Helvetica,Arial,sans-serif;
                    font-size: 15px;

                    text-rendering: optimizeLegibility;
                    text-size-adjust: 100%;
                }

                .dialog .icon {
                    margin: 10px;
                    padding-top: 20px;
                }
            `

            container.appendChild( style )

            resolve( container )
        } )
    } )
}

function createUIContainer(): Promise<HTMLElement> {
    return new Promise( resolve => {
        Logger.debug( "Creating a new UI container." )

        const container = $( document.createElement( "div", { is: "vue-container" } ) )
            .attr( "id", "nbrequirements-ui-container" )
            .attr( "class", "vue-container container" )
            .prependTo( "#notebook" )
            .get( 0 )

        $( container ).ready( function () {

            const ui = document.createElement( "div" )

            const style = document.createElement( "style" )
            style.textContent = `
            #nbrequirements-loader {
                display: flex;
                flex-direction: column;

                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;

                margin: auto;

                align-items: center;
                align-content: center;

                justify-content: center;
            }

            /* Fixes extra span margin inside the #button-add-requirement button */
            .button .icon {
                margin-right: unset!important;
            }

            .trapezoid {
                width: 100px;
                height: 0;

                margin: 0 auto;

                border-top: 30px solid #555;
                border-left: 25px solid transparent;
                border-right: 25px solid transparent;
            }

            .b-table .table {
                background-color: transparent;
            }
            `

            container.appendChild( style )
            container.appendChild( ui )

            resolve( ui )
        } )

    } )
}

export async function createUI(): Promise<UI> {
    const ui = await createUIContainer()
    const vm = new UI( {
        el: ui,
        store,
        beforeCreate: createNotificationContainer
    } )

    return vm
}

export { store }
