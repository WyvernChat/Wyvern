import express from "express"
import { database } from "../server"

export default function (app: express.Application) {
    app.get("/api/user", (req, res) => {
        const user = database.data.users.find((u) => u.token === req.headers.authorization)
        if (user) {
            res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    tag: user.tag
                }
            })
        } else {
            res.status(401).json({
                error: "Permission denied"
            })
        }
    })
    app.get("/api/user/:id/data", (req, res) => {
        const user = database.data.users.find((u) => u.id === req.params.id)
        if (user) {
            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    tag: user.tag
                }
            })
        } else {
            res.status(404).json({
                error: "User not Found"
            })
        }
    })
    app.get("/api/user/guilds", (req, res) => {
        const user = database.data.users.find((u) => u.token === req.headers.authorization)
        if (user) {
            res.status(200).json({
                guilds: user.guilds
            })
        } else {
            res.status(401).json({
                error: "Permission denied"
            })
        }
    })
    app.put("/api/user/guilds", (req, res) => {
        const user = database.data.users.find((u) => u.token === req.headers.authorization)
        if (user) {
            const guild = database.data.guilds.find((g) => g.id === req.body.guildId)
            if (guild) {
                user.guilds.push(guild.id)
                database.data.users.find((u) => u.id === user.id).guilds = user.guilds
                res.status(200).json({
                    success: "Guild joined",
                    guildID: guild.id
                })
            } else {
                res.status(400).json({
                    error: "Guild not found"
                })
            }
        } else {
            res.status(401).json({
                error: "Permission denied"
            })
        }
    })
}
