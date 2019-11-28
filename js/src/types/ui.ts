export interface UserWarning {
    context: any | null
    level: "warning" | "danger"
    msg: string
}