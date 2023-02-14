import { model, Schema } from "mongoose"
import { PushSubscription } from "web-push"

interface NotificationSubscription extends PushSubscription {
    userId: string
    ip: string
}

const NotificationSubscriptionSchema = new Schema<NotificationSubscription>(
    {
        userId: { type: String, required: true },
        ip: { type: String, required: true },
        endpoint: { type: String, required: true },
        keys: {
            p256dh: { type: String, required: true },
            auth: { type: String, required: true }
        }
    },
    {
        collection: "notificationSubscriptions"
    }
)

const NotificationSubscriptionModel = model(
    "NotificationSubscription",
    NotificationSubscriptionSchema
)

export { NotificationSubscriptionModel }
