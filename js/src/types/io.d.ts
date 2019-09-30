export interface Callbacks {
    iopub?: IOPubCallback
    shell?: ShellCallback
}

export interface IOPubCallback {
    output?: ( msg: Message ) => any
}

export interface ShellCallback {
    output?: ( msg: Message ) => any
    reply?: ( msg: Message ) => any
}

export interface Message {
    buffers: ( null )[] | null
    channel: string
    content: IOPubMessageContent
    msg_id: string
    msg_type: string
    header: IOPubMessageHeader
    parent_header: IOPubMessageHeader
    metadata: Metadata
}

export interface IOPubMessageContent {
    status: string
    data: IOPubMessageData
    name: string
    text: string
    metadata: any
    execution_count?: number
    ename?: string
    evalue?: string
    traceback?: string
}

export interface IOPubMessageData {
    name: string
    text: string
    "text/plain": string
}

export interface IOPubMessageHeader {
    date: string
    msg_id: string
    msg_type: string
    session: string
    username: string
    version: string
}

// eslint-disable-next-line
export interface Metadata { }
