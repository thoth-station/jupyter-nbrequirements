import Vue from "vue"
import Buefy from "buefy"

import { Logger } from "../config"

import store from "./store"
import UI from "./ui.vue"

// Create the UI
Vue.use( Buefy )


const container = document.createElement( "div" )
container.id = "v-app"

function createUIContainer(): void {
    Logger.debug( "Creating a new UI container." )
    const ui = $( "<div/>" )
        .attr( "id", "nbrequirements-ui" )
        .prependTo( "#notebook-container" )
        .click( function ( event ) {
            event.preventDefault()
            event.stopPropagation()

            return false
        } )
        .get( 0 )

    const style = document.createElement( "style" )
    style.textContent = `
    @import url( https://unpkg.com/buefy/dist/buefy.min.css );
    @import url( https://use.fontawesome.com/releases/v5.2.0/css/all.css );
    @import url( https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css );
    `

    const shadow = ui.attachShadow( { mode: "open" } )

    shadow.appendChild( container )
    shadow.appendChild( style )
}

export const vm = new UI( {
    el: container,
    store,
    beforeCreate: createUIContainer
} )