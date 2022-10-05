import express from "express"
import { GuildModel } from "../models/guild"
import { UserModel } from "../models/user"

export default function (app: express.Application) {
    app.get("/api/user", async (req, res) => {
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
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
    app.get("/api/user/guilds", async (req, res) => {
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
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
    app.put("/api/user/guilds", async (req, res) => {
        const user = await UserModel.findOne({
            token: req.headers.authorization
        })
        if (user) {
            const guild = await GuildModel.findOne({
                id: req.body.guildId
            })
            if (guild) {
                user.updateOne({
                    $push: {
                        guilds: guild.id
                    }
                })
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
    app.get("/api/user/:id", async (req, res) => {
        const user = await UserModel.findOne({
            id: req.params.id
        })
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
}
