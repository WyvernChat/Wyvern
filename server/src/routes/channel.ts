import express from "express"
import { getTextChannel } from "../datamanager"
import { database } from "../server"

export default function (app: express.Application) {
    // app.get("/channels/:channelId", (req, res) => {
    //     res.render("channel", {})
    // })
    app.get("/api/channels/:guildId/channels", (req, res) => {
        const channels = database.data.guilds.find((g) => g.id === req.params.guildId)?.channels
        if (channels) {
            res.status(200).json({
                channels: channels.map((c) => ({
                    name: c.name,
                    description: c.description,
                    type: c.type,
                    id: c.id
                }))
            })
        } else {
            res.status(404).json({
                error: "Channel not found"
            })
        }
    })

    app.get("/api/channels/:guildId/:channelId", (req, res) => {
        const channel = getTextChannel(database, req.params.guildId, req.params.channelId)
        const user = database.data.users.find(
            (u) => u.token === req.headers.authorization && u.guilds.includes(req.params.guildId)
        )
        if (channel && user) {
            res.status(200).json({
                channel: {
                    name: channel.name,
                    description: channel.description,
                    type: channel.type,
                    id: channel.id
                }
            })
        } else {
            res.status(401).json({
                error: "Permission denied"
            })
        }
    })
}
