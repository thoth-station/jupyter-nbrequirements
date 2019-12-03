import * as io from "./io"
import { Callbacks } from "./io"

export interface Context {
    cell: CodeCell
    output_area?: OutputArea
    status?: string
}

export interface CodeCell {
    cell_type: string
    events: any
    execution_count?: number
    metadata: CellMetadata
    output_area: OutputArea
    outputs?: any
    running?: boolean
    source: string

    get_callbacks: () => Callbacks

    toJSON: () => any
}

export interface CellMetadata { [ key: string ]: any }

export interface ExecuteTime {
    start_time: string
}

export interface OutputArea {
    append_error( err: OutputError ): void
    handle_output( msg: io.Message ): void
}

export interface OutputError {
    output_type: string,
    ename: string,
    evalue: string
    traceback: string[]
}
