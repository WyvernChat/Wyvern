import { randomBytes } from "crypto"
import express from "express"
import { UserModel } from "../models/user"

export default function (app: express.Application) {
    app.post("/api/auth/register", async (req, res) => {
        if (req.body.email && req.body.password && req.body.username) {
            if (
                !(await UserModel.exists({
                    email: req.body.email
                }))
            ) {
                if (/^\w{3,64}@.{4,255}/gi.test(req.body.email)) {
                    const user = await UserModel.create({
                        id: randomBytes(32).toString("hex"),
                        email: String(req.body.email).toLowerCase(),
                        password: req.body.password,
                        username: req.body.username,
                        tag: Math.floor(1000 + Math.random() * 9000),
                        token: randomBytes(32).toString("hex"),
                        guilds: []
                    })
                    res.status(201).json({
                        success: "User successfully created",
                        id: user.id
                    })
                } else {
                    res.status(400).json({
                        error: "Invalid email specified"
                    })
                }
            } else {
                res.status(400).json({
                    error: "The specified email is in already use"
                })
            }
        } else {
            res.status(400).json({
                error: "Email, username or password not specified"
            })
        }
    })
    app.post("/api/auth/login", async (req, res) => {
        if (req.body.email && req.body.password) {
            const user = await UserModel.findOne({
                email: req.body.email,
                password: req.body.password
            })
            if (user) {
                res.status(200).json({
                    token: user.token
                })
            } else {
                res.status(404).json({
                    error: "Invalid username or password"
                })
            }
        } else {
            res.status(400).json({
                error: "Email or password not specified"
            })
        }
    })
}
