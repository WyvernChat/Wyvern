import axios from "axios"
import { urlBase64ToUint8Array } from "./utils"

let pushSubscription: PushSubscription

navigator.serviceWorker
    .register("/worker.js")
    .then(async (registration) => {
        return registration.pushManager.getSubscription().then(async (subscription) => {
            if (subscription) return subscription
            const response = await axios.get("/api/notifications/vapidPublicKey")
            const vapidPublicKey: string = await response.data
            const convertedKey = urlBase64ToUint8Array(vapidPublicKey)
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
            })
        })
    })
    .then((subscription) => {
        // todo: send user token/id along with notification subscription
        pushSubscription = subscription
        console.log(subscription)
        const token = localStorage.getItem("token")
        if (token) {
            axios.post(
                "/api/notifications/register",
                { subscription },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
        }
    })

export { pushSubscription }
