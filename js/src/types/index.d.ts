// Type definitions

// --------------------------------------------------------------------------
// Some Types and Interfaces
// --------------------------------------------------------------------------

export namespace io {

    export interface Callbacks {
        iopub?: iopubCallback
        shell?: shellCallback
    }

    export interface iopubCallback {
        output: (msg: io.Message) => any
    }

    export interface shellCallback {
        output: (msg: io.Message) => any
    }

    export interface Message {
        buffers      : (null)[] | null
        channel      : string
        content      : iopubMessageContent
        msg_id       : string
        msg_type     : string
        header       : iopubMessageHeader
        parent_header: iopubMessageHeader
        metadata     : Metadata
    }

    export interface iopubMessageContent {
        data            : iopubMessageData
        name            : string
        text            : string
        metadata        : any
        execution_count?: number
        ename?          : string
        evalue?         : string
        traceback?      : string
    }

    export interface iopubMessageData {
        name        : string
        text        : string
        "text/plain": string
    }

    export interface iopubMessageHeader {
        date    : string
        msg_id  : string
        msg_type: string
        session : string
        username: string
        version : string
    }

    export interface Metadata { }
}


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


export interface Requirements {
    python_packages: any
    requires       : any
    source         : any[]
    "dev-python_packages"?: any
} 
