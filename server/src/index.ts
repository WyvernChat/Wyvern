import dotenv from "dotenv"
import { server } from "./server"

dotenv.config()

server.listen(parseInt(process.env.PORT) || 3000, process.env.HOST || "localhost", () => {
    console.log(
        `Server listening on http://${process.env.HOST || "localhost"}:${
            parseInt(process.env.PORT) || 3000
        }`
    )
})
