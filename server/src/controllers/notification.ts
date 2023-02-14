import webPush from "web-push"
import { NotificationSubscriptionModel } from "../models/notificationsubscription"

type SendNotificationOptions = {
    users: string[]
    payload: NotificationOptions
}

const sendNotification = async ({ users, payload }: SendNotificationOptions) => {
    const subscriptions = await NotificationSubscriptionModel.find({
        userId: {
            $in: users
        }
    })
    await Promise.all([
        subscriptions.map(async (subscription) => {
            await webPush.sendNotification(subscription, JSON.stringify(payload))
        })
    ])
}

export type { SendNotificationOptions }
export { sendNotification }
