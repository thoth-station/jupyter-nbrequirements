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