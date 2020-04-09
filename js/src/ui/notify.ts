import { ToastConfig, SnackbarConfig } from "buefy/types/components"

const DEFAULT_NOTIFICATION_CONTAINER = "#nbrequirements-notification-container"
const DEFAULT_NOTIFICATION_POSITION = "is-bottom"


export type Notification = SnackbarConfig | ToastConfig

export function newNotification( n: Notification, type: "toast" | "snackbar", context?: any ): Notification {
    const notification: Notification = {
        ...n,
        container: n.container || DEFAULT_NOTIFICATION_CONTAINER,
        position: n.position || DEFAULT_NOTIFICATION_POSITION,
        // this should be true in most cases, but allow to modify it anyway
        queue: n.queue !== undefined ? n.queue : true,
    }

    // @ts-ignore
    notification.__type__ = "ToastConfig"

    if ( type === "snackbar" ) {
        // @ts-ignore
        notification.__type__ = "SnackbarConfig"

        notification.duration = n.duration !== undefined ? n.duration || 5000 : undefined
        // @ts-ignore
        notification.onAction = n.onAction !== undefined ? n.onAction.bind( context ) : undefined
    }

    return notification
}