import webPush from "web-push"
import { NotificationSubscriptionModel } from "../models/notificationsubscription"

type SendNotificationOptions = {
    users: string[]
    payload: NotificationOptions & {
        title: string
    }
}

const sendNotification = async ({ users, payload }: SendNotificationOptions) => {
    const subscriptions = await NotificationSubscriptionModel.find({
        userId: {
            $in: users
        }
    })
    await Promise.all([
        subscriptions.map((subscription) =>
            webPush.sendNotification(subscription, JSON.stringify(payload)).catch((err) => err)
        )
    ])
}

export type { SendNotificationOptions }
export { sendNotification }
