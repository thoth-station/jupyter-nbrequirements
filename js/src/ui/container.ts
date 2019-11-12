export default class VueContainer extends HTMLDivElement {
    constructor() {
        super()
    }

    public connectedCallback() {
        const shadow = this.attachShadow( { mode: "open" } )
        const style = document.createElement( "style" )
        style.textContent = `\
        @import url( https://unpkg.com/buefy/dist/buefy.min.css );
        @import url(https://use.fontawesome.com/releases/v5.2.0/css/all.css);
        @import url(https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css);
        `

        shadow.appendChild( style )
    }

    public append( ...children: ( string | Node )[] ): void {
        if ( this.shadowRoot ) {
            this.shadowRoot.append( ...children )
        }
        else throw new Error( "This component has no shadow root." )
    }


    public appendChild( child: Node ): any | null {
        let node: Node | null = null

        if ( this.shadowRoot ) {
            node = this.shadowRoot.appendChild( child )
        }
        else throw new Error( "This component has no shadow root." )

        return node
    }
}