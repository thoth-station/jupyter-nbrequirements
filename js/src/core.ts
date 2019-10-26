/**
 * Core.
 *
 * Core functionality to execute requests and handle workloads.
 *
 * @link   https://github.com/CermakM/jupyter-nbrequirements#readme
 * @file   This file implements core functionality to execute requests.
 * @author Marek Cermak <macermak@redhat.com>
 * @since  0.0.1
 */

import _ from "lodash"

import { Logger } from "./config"

import * as io from "./types/io"
import { Context, CodeCell } from "./types/nb"
import { ILogger } from "js-logger/src/types"

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require( "base/js/namespace" )


export function execute_request( request: string, callbacks?: io.Callbacks, options?: any, context?: any ) {
    return new Promise( ( resolve, reject ) => {
        let logger = Logger
        if ( !_.isUndefined( options ) && !_.isUndefined( options.logger ) )
            logger = options.logger

        const default_options = {
            silent: false,
            store_history: true,
            stop_on_error: true
        }

        if ( _.isUndefined( context ) ) {
            // passing the logger here makes logs more consistent
            context = get_execute_context( logger )
        }

        const cell = context.cell
        const kernel = Jupyter.notebook.kernel

        options = _.assign( default_options, options )
        callbacks = _.assign( cell.get_callbacks(), callbacks || {} )

        // Make sure to mark the cell as running so that the output
        // is positioned correctly
        cell.running = true

        // @ts-ignore
        const shell_reply = callbacks.shell.reply
        const shell_reply_wrapper = async ( msg: io.Message ) => {

            if ( msg.msg_type === "execute_reply" ) {
                cell.running = false
            }

            msg.metadata.status = kernel._msg_callbacks[ msg_id ].status
            msg.metadata.output = kernel._msg_callbacks[ msg_id ].output

            try {
                // @ts-ignore
                shell_reply( msg )
            } catch ( err ) {
                Logger.error( err )
            }
        }

        // @ts-ignore
        const iopub_output_callback = callbacks.iopub.output
        const iopub_output_wrapper = async ( msg: io.Message ) => {

            let status = 0
            let output = ""

            cell.running = true

            if ( msg.msg_type == "error" ) {
                status = -1
                output = `${ msg.content.ename }: ${ msg.content.evalue }`
            }

            else if ( msg.msg_type == "stream" ) {
                const m = msg.content.text.search( /\[exit\]: ([^0])/m )
                if ( m >= 0 ) {
                    status = Number( msg.content.text[ m ] )
                    // Use preferably output of the parent message instead
                    output = kernel._msg_callbacks[ msg_id ].output
                    if ( _.isUndefined( output ) ) {
                        output = msg.content.text
                    }
                } else {
                    output = msg.content.text
                }
            }

            msg.metadata.status = status
            msg.metadata.output = output.replace( /\[exit\]: (\d)+[\s\n\r]*$/m, "" )

            kernel._msg_callbacks[ msg_id ].status = msg.metadata.status
            kernel._msg_callbacks[ msg_id ].output = msg.metadata.output

            try {
                // @ts-ignore
                iopub_output_callback( msg )
            } catch ( err ) {
                Logger.error( err )
            }
        }

        callbacks = _.assign(
            callbacks,
            {
                iopub: { output: iopub_output_wrapper },
                shell: { reply: shell_reply_wrapper }
            }
        )

        logger.debug( `Executing shell request:\n${ request }\n\twith callbacks: `, callbacks )
        const msg_id = kernel.execute( request, callbacks, options )

        kernel.events.on(
            "finished_iopub.Kernel",
            ( e: Event, d: { kernel: any, msg_id: string } ) => {
                if ( d.msg_id === msg_id ) {
                    kernel._msg_callbacks[ msg_id ].status != 0 ? reject() : resolve()
                }
            } )
    } )
}

export function get_execute_context( logger?: ILogger ): Context | undefined {
    const cell: CodeCell = Jupyter.notebook.get_executed_cell()

    logger = logger || Logger
    if ( _.isUndefined( cell ) ) {
        logger.warn( "Execution context could not be determined." )
        return
    }

    return {
        cell: cell,
        output_area: cell.output_area
    }
}

export function execute_shell_command( command: string, callbacks?: io.Callbacks, options?: any, context?: any ) {
    // wrap it so that we could get the exit status code
    command = `${ command } ; >&2 echo "[exit]: $?"`

    return execute_request( `!${ command }`, callbacks, options, context )
}

export function execute_shell_script( script: string, callbacks?: io.Callbacks, options?: any, context?: any ) {

    return execute_request( `%%bash\n${ script }`, callbacks, options, context )
}

export function execute_python_script( script: string, callbacks?: io.Callbacks, options?: any, context?: any ) {

    return execute_request( `${ script }`, callbacks, options, context )
}
