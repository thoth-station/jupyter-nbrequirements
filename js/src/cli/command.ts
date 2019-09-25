/**
 * Command.
 *
 * Command base class.
 *
 * @link   https://github.com/CermakM/jupyter-nbrequirements#readme
 * @file   This module implements base interface for all commands.
 * @author Marek Cermak <macermak@redhat.com>
 * @since  0.0.1
 */

import { Context } from '../types';

export interface DefaultArguments {
    // show this help message and exit
    help: boolean
    // Whether to ignore embedded notebook metadata
    ignore_metadata: boolean
    // Whether to display output in JSON format
    to_json: boolean
    // Whether to store output to file
    to_file: boolean
    // Whether to overwrite existing file
    overwrite: boolean
}

/**
 * Base class for all commands.
 *
 * @export
 * @interface Command
 */
export default abstract class Command {
    // Show help and exit
    public static help?(): string

    // Run the command
    public abstract run( args: DefaultArguments, element?: HTMLDivElement, context?: Context ): void | Promise<any>

    // Validate arguments
    protected validate( args: DefaultArguments ): void | never { }
}
