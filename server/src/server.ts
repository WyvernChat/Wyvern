import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import fs from "fs"
import { createServer } from "http"
import { join, resolve } from "path"
import { Database, WyvernDatabase } from "./database"
import { initSockets } from "./sockets"

const app = express()
const server = createServer(app)

dotenv.config({ path: join(__dirname, "../../.env") })

app.use(express.json())
app.use(
    cors({
        origin: process.env.ALLOW_ORIGINS.split(","),
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
)

const io = initSockets(server)
const database = new Database<WyvernDatabase>(join(__dirname, "..", "database.json"), {
    guilds: [],
    users: []
})

fs.readdirSync(join(__dirname, "routes")).forEach((file) => {
    import("./" + join("routes", file)).then((r) => r.default(app))
})

if (process.env.NODE_ENV === "production") {
    console.log("Loading production app")
    app.get(/^\/(?!api).*/, express.static("../client/build"))
    app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(resolve("../client/build/index.html")))
}

export { server, io }
