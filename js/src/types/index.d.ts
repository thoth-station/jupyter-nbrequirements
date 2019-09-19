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


    export interface iopubMessageHeader {
        date: string
        msg_id: string
        msg_type: string
        session: string
        username: string
        version: string
    }

    export interface iopubMessageData {
        name: string
        text: string
        "text/plain": string
    }

    export interface iopubMessageContent {
        data: iopubMessageData
        metadata: any
        execution_count?: number
        ename?: string
        evalue?: string
        traceback?: string
    }

    export interface Message {
        content: iopubMessageContent
        header: iopubMessageHeader
        msg_id: string
        msg_type: string
    }
}

export interface CodeCell {
    cell: Cell;
    output_area?: any;
}

export interface Cell {
    metadata: CellMetadata;
    cell_type: string;
    source: string;
    execution_count?: number;
    outputs?: any;
}

export interface CellMetadata {
    ExecuteTime: ExecuteTime;
    require?: Requirements;
    trusted: boolean;
}

export interface ExecuteTime {
    start_time: string;
}

export interface Requirements {
    python_packages: any
    requires: any
    source: any[]
    "dev-python_packages"?: any
} 
