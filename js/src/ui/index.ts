import Vue from "vue"
import Buefy from "buefy"

import { Logger } from "../config"

import store from "./store"

import UI from "./ui.vue"
import VueContainer from "./container"

// Create the UI
Vue.use( Buefy )

customElements.define( "vue-container", VueContainer, { extends: "div" } )


function createNotificationContainer(): HTMLElement {
    Logger.debug( "Creating a new notification container." )

    const container = $( document.createElement( "div", { is: "vue-container" } ) )
        .attr( "id", "nbrequirements-notification-container" )
        .prependTo( "#notebook" )
        .get( 0 )

    const style = document.createElement( "style" )
    style.textContent = `
        .notices * {
            font-family: BlinkMacSystemFont,-apple-system,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,Helvetica,Arial,sans-serif;
            font-size: 15px;

            text-rendering: optimizeLegibility;
            text-size-adjust: 100%;
        }
    `

    container.appendChild( style )
    return container
}

function createUIContainer(): HTMLElement {
    Logger.debug( "Creating a new UI container." )

    const container = $( document.createElement( "div", { is: "vue-container" } ) )
        .attr( "id", "nbrequirements-ui-container" )
        .attr( "class", "vue-container container" )
        .prependTo( "#notebook" )
        .get( 0 )

    const style = document.createElement( "style" )
    style.textContent = `
        .trapezoid {
            border-top: 30px solid #555;
            border-left: 25px solid transparent;
            border-right: 25px solid transparent;
            height: 0;
            width: 100px;
        }

        .b-table .table {
            background-color: transparent;
        }
    `
    const ui = document.createElement( "div" )

    container.appendChild( style )
    container.appendChild( ui )
    return ui
}

export function createUI(): UI {
    const ui = createUIContainer()
    const vm = new UI( {
        el: ui,
        store,
        beforeCreate: createNotificationContainer
    } )

    return vm
}