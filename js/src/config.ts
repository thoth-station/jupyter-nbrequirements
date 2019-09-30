import Logger from "js-logger"
import { ILogLevel, IContext, ILogger } from "js-logger/src/types"


declare const DEFAULT_LOGGING_LEVEL: ILogLevel

Logger.useDefaults( {
    defaultLevel: DEFAULT_LOGGING_LEVEL || Logger.INFO,
    formatter: function ( messages: any[], context: IContext ): void {
        const name = context.name || "nbrequirements"
        const date = new Date().toUTCString()

        messages.unshift( `${ date } [${ name }] ${ context.level.name }:` )
    }
} )

export function getLogger( name: string ): ILogger {
    return Logger.get( name )
}

export { Logger }
