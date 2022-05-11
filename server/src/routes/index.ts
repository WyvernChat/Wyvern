import express from "express"

export default function (app: express.Application) {
    app.get("/", (req, res) => {
        res.json({
            fake: "just a fake test"
        })
    })
}
