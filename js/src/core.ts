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

import _ from 'lodash'
import { io } from './types'
import { Context } from './types';
import { OutputArea, CodeCell } from './types/index';

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require("base/js/namespace")


export function execute_request(request: string, callbacks?: io.Callbacks, options?: any, context?: any) {
    return new Promise( resolve => {
        const default_options = {
            silent: false,
            store_history: true,
            stop_on_error: true
        }

        if (_.isUndefined(context)) {
            context = get_execute_context()
        }
        const cell = context.cell

        options   = _.assign(default_options, options)
        callbacks = _.assign(cell.get_callbacks(), callbacks || {})

        const kernel = Jupyter.notebook.kernel

        console.debug(`Executing shell request:\n${request}\n\twith callbacks: `, callbacks)

        const msg_id = kernel.execute(request, callbacks, options)
        kernel.events.on("finished_iopub.Kernel", (e: Event, d: io.Message) => {
            if ( d.msg_id === msg_id ) {
                resolve()
            }
        })
    })
}

export function execute_shell_command(command: string, callbacks?: io.Callbacks, options?: any, context?: any) {
    
    return execute_request(`!${command}`, callbacks, options, context)
}

export function execute_shell_script(script: string, callbacks?: io.Callbacks, options?: any, context?: any) {
    
    return execute_request(`%%bash\n${script}`, callbacks, options, context)
}

export function execute_python_script(script: string, callbacks?: io.Callbacks, options?: any, context?: any) {
    
    return execute_request(`${script}`, callbacks, options, context)
}

export function get_execute_context(): Context | undefined {
    const cell: CodeCell = Jupyter.notebook.get_executed_cell()
    if (_.isUndefined(cell)) {
        console.warn("Execution context could not be determined.")
        return
    }

    return {
        cell: cell,
        output_area: cell.output_area
    }
}
