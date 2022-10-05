import dotenv from "dotenv"
import mongoose from "mongoose"
import { join } from "path"
import { server } from "./server"

dotenv.config({ path: join(__dirname, "../../.env") })

mongoose.connect(process.env.DATABASE_URL, {}).then(() => {
    console.log("Connected to mongodb server")
})

server.listen(parseInt(process.env.PORT) || 3000, process.env.HOST || "localhost", () => {
    console.log(
        `Server listening on http://${process.env.HOST || "localhost"}:${
            parseInt(process.env.PORT) || 3000
        }`
    )
})
