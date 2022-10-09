import express from "express"
import { TextChannelModel } from "../models/channel"
import { UserModel } from "../models/user"

export default function (app: express.Application) {
    // app.get("/channels/:channelId", (req, res) => {
    //     res.render("channel", {})
    // })

    app.get("/api/channels/:channelId", async (req, res) => {
        const channel = await TextChannelModel.findOne({
            id: req.params.channelId
        })
        const user = await UserModel.findOne({
            token: req.headers.authorization,
            guilds: channel.guild
        })
        if (channel && user) {
            res.status(200).json({
                channel: {
                    name: channel.name,
                    description: channel.description,
                    type: channel.type,
                    id: channel.id,
                    guild: channel.guild
                }
            })
        } else {
            res.status(401).json({
                error: "Permission denied"
            })
        }
    })

    app.get("/api/channels/:channelId/messages", async (req, res) => {
        const channel = await TextChannelModel.findOne({
            id: req.params.channelId
        })
        const user = await UserModel.findOne({
            token: req.headers.authorization,
            guilds: channel.guild
        })
        if (channel && user) {
            const limit = Math.min(parseInt(req.query.limit as string) || 50, 100)
            const beforeId = req.query.before as string
            const beforeIndex = channel.messages.findIndex((m) => m.id === beforeId)

            if (beforeIndex !== -1) {
                const beforeMessages = channel.messages.slice(0, beforeIndex)
                // console.log(beforeIndex, beforeId)
                // console.log(
                //     beforeMessages.map((m) => m.id),
                //     channel.messages.map((m) => m.id)
                // )
                res.status(200).json(beforeMessages.slice(-limit))
            } else {
                res.status(200).json(channel.messages.slice(-limit))
            }
        } else {
            res.status(401).json({
                error: "Permission denied"
            })
        }
    })
}
