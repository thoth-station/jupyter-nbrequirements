export interface Callbacks {
    iopub?: iopubCallback
    shell?: shellCallback
}

export interface iopubCallback {
    output: (msg: Message) => any
}

export interface shellCallback {
    output: (msg: Message) => any
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
