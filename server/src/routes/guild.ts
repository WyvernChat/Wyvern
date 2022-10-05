import { randomBytes } from "crypto"
import express from "express"
import { TextChannelModel } from "../models/channel"
import { GuildModel } from "../models/guild"
import { UserModel } from "../models/user"

export default function (app: express.Application) {
    app.post("/api/guilds/create", async (req, res) => {
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
        if (user) {
            if (req.body.guildName) {
                const guild = await GuildModel.create({
                    id: randomBytes(16).toString("hex"),
                    name: req.body.guildName,
                    owner: user.id,
                    channels: [],
                    members: [user.id],
                    invites: [randomBytes(10).toString("hex")]
                })
                const channel = await TextChannelModel.create({
                    guild: guild.id,
                    name: "general",
                    description: "",
                    type: "TEXT",
                    id: randomBytes(16).toString("hex")
                })
                await guild.updateOne({
                    $push: {
                        channels: channel.id
                    }
                })
                await user.updateOne({
                    $push: {
                        guilds: guild.id
                    }
                })
                res.status(201).json({
                    id: guild.id,
                    invite: guild.invites[0]
                })
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
                res.status(200).json(guild)
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

    app.post("/api/guilds/:guildId/channels", async (req, res) => {
        const guild = await GuildModel.findOne({
            id: req.params.guildId
        })
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
        if (user) {
            if (guild && guild.members.includes(user.id) && guild.owner === user.id) {
                const channel = await TextChannelModel.create({
                    name: req.body.name || "undefined",
                    description: "",
                    type: "TEXT",
                    slowmode: 0,
                    messages: [],
                    id: randomBytes(16).toString("hex")
                })
                await guild.updateOne({
                    $push: {
                        channels: channel.id
                    }
                })
                res.json({
                    id: channel.id,
                    name: channel.name
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

    app.get("/api/guilds/:guildId/invites", async (req, res) => {
        const guild = await GuildModel.findOne({
            id: req.params.guildId
        })
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
        if (user && guild) {
            if (guild.members.find((u) => u === user.id)) {
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
        const guild = await GuildModel.findOne({
            invites: req.params.inviteCode
        })
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
        if (guild && user) {
            if (!guild.members.includes(user.id)) {
                await guild.updateOne({
                    $push: {
                        members: user.id
                    }
                })
                await user.updateOne({
                    $push: {
                        guilds: guild.id
                    }
                })
                res.status(201).json({
                    name: guild.name,
                    id: guild.id
                })
            } else {
                res.status(200).json({
                    name: guild.name,
                    id: guild.id,
                    message: "User is already in this guild!"
                })
            }
        } else {
            res.status(404).json({
                error: "Guild not found"
            })
        }
    })
}
