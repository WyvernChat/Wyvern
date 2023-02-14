import express from "express"
import webPush, { PushSubscription } from "web-push"
import { NotificationSubscriptionModel } from "../models/notificationsubscription"
import { UserModel } from "../models/user"

export default function (app: express.Application) {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
        console.log(
            "No VAPID keys were found, please add these to .env",
            webPush.generateVAPIDKeys()
        )
        return
    }
    webPush.setVapidDetails(
        "https://wyvern.tkdkid1000.net",
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    )
    app.get("/api/notifications/vapidPublicKey", (req, res) => {
        res.send(process.env.VAPID_PUBLIC_KEY)
    })
    app.post("/api/notifications/register", async (req, res) => {
        if (req.headers.authorization && req.body.subscription) {
            const user = await UserModel.findOne({ token: req.headers.authorization })
            if (user) {
                const subscription = req.body.subscription as PushSubscription
                if (subscription.endpoint && subscription.keys) {
                    if (
                        !(await NotificationSubscriptionModel.exists({
                            ip: req.ip,
                            userId: user.id
                        }))
                    ) {
                        await NotificationSubscriptionModel.create({
                            userId: user.id,
                            endpoint: subscription.endpoint,
                            keys: subscription.keys,
                            ip: req.ip
                        })
                        res.sendStatus(201)
                    }
                }
            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(400)
        }
    })
    app.post("/api/notifications/sendNotification", (req, res) => {
        // todo: remove test notification route and implement globally
        const { subscription, payload } = req.body
        const options = {
            TTL: req.body.ttl
        }
        console.log("received notification with", { subscription, payload, options })

        webPush
            .sendNotification(subscription, payload)
            .then(() => {
                res.sendStatus(201)
            })
            .catch((error) => {
                console.log(error)
                res.sendStatus(500)
            })
    })
}
