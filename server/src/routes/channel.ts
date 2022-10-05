import express from "express"
import { TextChannelModel } from "../models/channel"
import { GuildModel } from "../models/guild"
import { UserModel } from "../models/user"

export default function (app: express.Application) {
    // app.get("/channels/:channelId", (req, res) => {
    //     res.render("channel", {})
    // })
    app.get("/api/channels/:guildId/channels", async (req, res) => {
        const guild = await GuildModel.findOne({
            id: req.params.guildId
        })
        if (guild) {
            const channelData = await TextChannelModel.find({
                guild: req.params.guildId
            })
            res.status(200).json({
                channels: channelData.map((c) => ({
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

    app.get("/api/channels/:guildId/:channelId", async (req, res) => {
        const channel = await TextChannelModel.findOne({
            id: req.params.channelId
        })
        const user = await UserModel.findOne({
            token: req.headers.authorization,
            guilds: req.params.guildId
        })
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

    app.get("/api/channels/:guildId/:channelId/messages", async (req, res) => {
        const channel = await TextChannelModel.findOne({
            id: req.params.channelId
        })
        const user = await UserModel.findOne({
            token: req.headers.authorization,
            guilds: req.params.guildId
        })
        if (channel && user) {
            res.status(200).json({
                channel: channel.id,
                messages: channel.messages
            })
        } else {
            res.status(401).json({
                error: "Permission denied"
            })
        }
    })
}
