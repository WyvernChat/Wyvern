import express from "express"
import { createGuild, joinGuild } from "../controllers/guild"
import { createTextChannel } from "../controllers/textChannel"
import { TextChannelModel } from "../models/channel"
import { GuildModel } from "../models/guild"
import { UserModel } from "../models/user"

export default function (app: express.Application) {
    app.post("/api/guilds", async (req, res) => {
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
        if (user) {
            if (req.body.guildName) {
                const guild = await createGuild({
                    owner: user.id,
                    name: req.body.guildName
                })
                res.status(201).json(guild)
            } else {
                res.status(400).json({
                    error: "Guild name not specified"
                })
            }
        } else {
            res.status(401).json({
                error: "Permission denied"
            })
        }
    })

    app.get("/api/guilds/:guildId", async (req, res) => {
        const user = await UserModel.findOne({
            token: req.headers.authorization,
            guilds: req.params.guildId
        })
        if (user) {
            const guild = await GuildModel.findOne({
                id: req.params.guildId
            })
            if (guild) {
                res.status(200).json({
                    id: guild.id,
                    name: guild.name,
                    owner: guild.owner
                })
            } else {
                res.status(404).json({
                    error: "Guild not found"
                })
            }
        } else {
            res.status(401).json({
                error: "Permission denied"
            })
        }
    })

    app.get("/api/guilds/:guildId/channels", async (req, res) => {
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
                error: "Guild not found"
            })
        }
    })

    app.post("/api/guilds/:guildId/channels", async (req, res) => {
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
        if (user) {
            try {
                const channel = await createTextChannel({
                    name: req.body.name || "undefined",
                    guildId: req.params.guildId,
                    userId: user.id
                })
                res.json({
                    id: channel.id,
                    name: channel.name
                })
            } catch (error) {
                res.status(403).json({
                    error
                })
            }
        } else {
            res.status(401).json({
                error: "Permission denied"
            })
        }
    })

    app.get("/api/guilds/:guildId/invites", async (req, res) => {
        const guild = await GuildModel.findOne({
            id: req.params.guildId
        })
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
        if (user && guild) {
            if (guild.members.includes(user.id)) {
                res.status(200).json({
                    invites: [guild.invites]
                })
            } else {
                res.status(401).json({
                    error: "Permission denied"
                })
            }
        } else {
            res.status(404).json({
                error: "Guild not found"
            })
        }
    })

    app.post("/api/guilds/invites/:inviteCode/join", async (req, res) => {
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
        if (user) {
            // await guild.updateOne({
            //     $push: {
            //         members: user.id
            //     }
            // })
            // await user.updateOne({
            //     $push: {
            //         guilds: guild.id
            //     }
            // })
            try {
                const guild = await joinGuild({
                    userId: user.id,
                    invite: req.params.inviteCode
                })
                res.status(201).json({
                    name: guild.name,
                    id: guild.id
                })
            } catch (error) {
                res.status(404).json({ error })
            }
        } else {
            res.status(404).json({
                error: "Guild not found"
            })
        }
    })
}
