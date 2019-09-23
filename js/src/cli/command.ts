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
    public abstract run(args: any, element?: HTMLDivElement, context?: Context): void | Promise<any>

    // Validate arguments
    protected validate(args: any): void | never {}
}
