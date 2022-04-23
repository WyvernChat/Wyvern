import crypto from "crypto"
import express from "express"
import { User } from "../globals"
import { database } from "../server"

export default function (app: express.Application) {
    // app.get("/register", (req, res) => {
    //     res.render("register")
    // })
    app.post("/api/auth/register", (req, res) => {
        if (req.body.email && req.body.password && req.body.username) {
            if (
                !database.data.users.find(
                    (u) => u.email.toLowerCase() === String(req.body.email).toLowerCase()
                )
            ) {
                if (/^\w{3,64}@.{4,255}/gi.test(req.body.email)) {
                    const user: User = {
                        id: crypto.randomBytes(32).toString("hex"),
                        email: String(req.body.email).toLowerCase(),
                        password: req.body.password,
                        username: req.body.username,
                        tag: Math.floor(1000 + Math.random() * 9000),
                        token: crypto.randomBytes(32).toString("hex"),
                        guilds: []
                    }
                    database.data.users.push(user)
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
    app.get("/api/auth/isEmailAvailable/:email", (req, res) => {
        if (
            database.data.users.find(
                (u) => u.email.toLowerCase() === String(req.params.email).toLowerCase()
            )
        ) {
            res.status(200).json({
                success: "Email is not available",
                available: false
            })
        } else {
            res.status(200).json({
                success: "Email is available",
                available: true
            })
        }
    })
    // app.get("/login", (req, res) => {
    //     res.render("login")
    // })
    app.post("/api/auth/login", (req, res) => {
        console.log(req)
        if (req.body.email && req.body.password) {
            const user = database.data.users.find((u) => u.email === req.body.email)
            if (user) {
                if (user.password === req.body.password) {
                    res.status(200).json({
                        token: user.token
                    })
                } else {
                    res.status(401).json({
                        error: "Password is incorrect"
                    })
                }
            } else {
                res.status(404).json({
                    error: "User could not be found"
                })
            }
        } else {
            res.status(400).json({
                error: "Email or password not specified"
            })
        }
    })
    // app.get("/logout", (req, res) => {
    //     res.render("logout")
    // })
}
