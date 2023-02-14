import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import fs from "fs"
import http from "http"
import https from "https"
import { join, resolve } from "path"
import { initSockets } from "./sockets"

dotenv.config({ path: join(__dirname, "../../.env") })

const app = express()
const server =
    process.env.SSL === "true"
        ? https.createServer(
              {
                  key: fs.readFileSync(process.env.SSL_KEY).toString(),
                  cert: fs.readFileSync(process.env.SSL_CERT).toString()
              },
              app
          )
        : http.createServer(app)

dotenv.config({ path: join(__dirname, "../../.env") })

app.use(express.json())
app.use(
    cors({
        origin: process.env.ALLOW_ORIGINS.split(","),
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
)
app.set("trust proxy", true)

const io = initSockets(server)

fs.readdirSync(join(__dirname, "routes")).forEach((file) => {
    import("./" + join("routes", file)).then((r) => r.default(app))
})

if (process.env.NODE_ENV === "production") {
    console.log("Loading production app")
    app.get(/^\/(?!api).*/, express.static("../client/build"))
    app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(resolve("../client/build/index.html")))
}

export { server, io }
