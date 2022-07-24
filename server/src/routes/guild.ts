import crypto from "crypto"
import express from "express"
import { Guild, TextChannel } from "../globals"
import { database } from "../server"

export default function (app: express.Application) {
    app.post("/api/guilds/create", (req, res) => {
        const user = database.data.users.find((u) => u.token === req.headers.authorization)
        if (user) {
            if (req.body.guildName) {
                const guild: Guild = {
                    id: crypto.randomBytes(16).toString("hex"),
                    name: req.body.guildName,
                    owner: user.id,
                    channels: [
                        {
                            name: "general",
                            description: "General chat - no memes in general",
                            type: "TEXT",
                            slowmode: 0,
                            messages: [],
                            id: crypto.randomBytes(16).toString("hex")
                        } as TextChannel
                    ],
                    members: [user.id],
                    invites: [crypto.randomBytes(10).toString("hex")]
                }
                user.guilds.push(guild.id)
                database.data.users.find((u) => u.id === user.id).guilds = user.guilds
                database.data.guilds.push(guild)
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

    app.get("/api/guilds/:guildId", (req, res) => {
        const guild = database.data.guilds.find((g) => g.id === req.params.guildId)
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
    })

    app.post("/api/guilds/:guildId/createChannel", (req, res) => {
        const guild = database.data.guilds.find((g) => g.id === req.params.guildId)
        const user = database.data.users.find((u) => u.token === req.headers.authorization)
        if (user) {
            if (guild && guild.members.includes(user.id) && guild.owner === user.id) {
                const channel = {
                    name: req.body.name || "undefined",
                    description: "",
                    type: "TEXT",
                    slowmode: 0,
                    messages: [],
                    id: crypto.randomBytes(16).toString("hex")
                } as TextChannel
                guild.channels.push(channel)
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

    app.get("/api/guilds/:guildId/invites", (req, res) => {
        const user = database.data.users.find((u) => u.token === req.headers.authorization)
        const guild = database.data.guilds.find((g) => g.id === req.params.guildId)
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

    app.post("/api/guilds/invites/:inviteCode/join", (req, res) => {
        const guild = database.data.guilds.find((g) => g.invites.includes(req.params.inviteCode))
        const user = database.data.users.find((u) => u.token === req.headers.authorization)

        if (guild && user) {
            if (!guild.members.includes(user.id)) {
                guild.members.push(user.id)
                user.guilds.push(guild.id)
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
