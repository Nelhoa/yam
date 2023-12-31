import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

type alert = {
    message: string,
    uuid: string,
}

export const alerts = writable([] as alert[])

export function newAlert(message: string | null = null) {
    if (!message || message === '' || typeof message !== 'string') return null
    const newAlert: alert = { message, uuid: uuidv4() }
    alerts.update((alert) => {
        return [...alert, newAlert]
    })
}

export function deleteAlert(deletedAlert: alert) {
    alerts.update((alert) => {
        return alert.filter(cur => cur.uuid != deletedAlert.uuid)
    })
}

export function deleteAllAllerts() {
    alerts.set([] as alert[])
}