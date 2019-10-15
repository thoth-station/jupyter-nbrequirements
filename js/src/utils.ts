/**
 * Utilities.
 *
 * A module containing common functions and utilities.
 *
 * @file   A file containing common functions and utilities.
 * @author Marek Cermak <macermak@redhat.com>
 * @since  0.0.1
 */

import _ from "lodash"

import { Logger } from "./config";
// @ts-ignore
import nbutils = require( "base/js/utils" )

export function display( s: any, output: HTMLDivElement ): void {
    output.append( `<pre>${ JSON.stringify( s, null, 2 ) }</pre>` )
}

export function parse_console_output( stream: string ): string {
    const ansi_re = /\x1b\[(.*?)([@-~])/g  // eslint-disable-line

    // Ensure markup for trailing text
    stream = _.escape( stream ) + "\x1b[m"

    const out = []
    let start = 0

    // eslint-disable-next-line
    for ( let match: RegExpMatchArray | null; match = ansi_re.exec( stream ); ) {
        const chunk = stream.substring( start, match.index )
        if ( chunk ) out.push( chunk )

        start = ansi_re.lastIndex
    }

    const result = out.join( "" )

    return _.flow( nbutils.fixBackspace, nbutils.fixCarriageReturn )( result ) as string
}

export function dedent(
    strings: string | string[],
    ...values: string[]
) {

    // @ts-ignore
    const raw = typeof strings === "string" ? [ strings ] : strings.raw

    // first, perform interpolation
    let result = ""
    for ( let i = 0; i < raw.length; i++ ) {
        result += raw[ i ]
            // join lines when there is a suppressed newline
            .replace( /\\\n[ \t]*/g, "" )
            // handle escaped backticks
            .replace( /\\`/g, "`" )

        if ( i < values.length ) {
            result += values[ i ]
        }
    }

    // now strip indentation
    const lines = result.split( "\n" )

    let mindent: number | null = null
    lines.forEach( l => {
        const m = l.match( /^(\s+)\S+/ )
        if ( m ) {
            const indent = m[ 1 ].length
            if ( !mindent ) {
                // this is the first indented line
                mindent = indent
            } else {
                mindent = Math.min( mindent, indent )
            }
        }
    } )

    if ( mindent !== null ) {
        const m = mindent // appease Flow
        result = lines.map( l => l[ 0 ] === " " ? l.slice( m ) : l ).join( "\n" )
    }

    return result
        // dedent eats leading and trailing whitespace too
        .trim()
        // handle escaped newlines at the end to ensure they don't get stripped too
        .replace( /\\n/g, "\n" )
}

export function indent( text: string, indent = 4 ) {
    const indentation = " ".repeat( indent )

    return text
        .split( "\n" )
        .map( ( line ) => `${ indentation }${ line }` )
        .join( "\n" )
}


export function notify( title: string, options?: NotificationOptions ): void {
    options = _.merge( {
        icon: "https://github.com/CermakM/jupyter-nbrequirements/blob/notify/assets/main-logo.png?raw=true",
    }, options )

    if ( !( "Notification" in window ) ) {
        Logger.warn( "This browser does not support desktop notifications. Notification: ", title )
    }

    // Let's check whether notification permissions have already been granted
    else if ( Notification.permission === "granted" ) {
        // If it's okay let's create a notification
        const notification = new Notification( title, options )
        Logger.debug( "Notification has been sent: ", notification )
    }

    // Otherwise, we need to ask the user for permission
    else if ( Notification.permission !== "denied" ) {
        Notification.requestPermission().then( function ( permission ) {
            // If the user accepts, let's create a notification
            if ( permission === "granted" ) {
                const notification = new Notification( title, options )
                Logger.debug( "Notification has been sent: ", notification )
            } else {
                Logger.debug( "Notifications are disabled for notification: ", title )
            }
        } )
    }
}
