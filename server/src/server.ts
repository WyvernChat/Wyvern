import cors from "cors"
import express from "express"
import fs from "fs"
import { createServer } from "http"
import path from "path"
import { Database, WyvernDatabase } from "./database"
import { initSockets } from "./sockets"

const app = express()
const server = createServer(app)
const io = initSockets(server)
const database = new Database<WyvernDatabase>(path.join(__dirname, "..", "database.json"), {
    guilds: [],
    users: []
})

app.use(express.json())
app.use(cors())

fs.readdirSync(path.join(__dirname, "routes")).forEach((file) => {
    import("./" + path.join("routes", file)).then((r) => r.default(app))
})

process.stdin.on("data", (key) => {
    if (key.toString().trim() === "rl") {
        database.reload()
        console.log("Reloading database...")
    }
})

export { database, server, io }
