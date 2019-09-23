import * as io from './io'
import { Requirements } from './requirements';

export interface Context {
    cell        : CodeCell
    output_area?: OutputArea
}

export interface CodeCell {
    events          : any
    metadata        : CellMetadata
    cell_type       : string
    source          : string
    output_area     : OutputArea
    execution_count?: number
    outputs?        : any
}

export interface CellMetadata {
    ExecuteTime: ExecuteTime
    require?   : Requirements
    trusted    : boolean
}

export interface ExecuteTime {
    start_time: string
}

export interface OutputArea {
    handle_output(msg: io.Message): void
}