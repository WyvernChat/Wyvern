import axios from "axios"
import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"
import { createElement } from "react"
import { createRoot } from "react-dom/client"
import { io } from "socket.io-client"
import { App } from "./App"
import "./scss/main.scss"

const serverUri = __API_URI__
const production = __APP_ENV__ === "PRODUCTION"
const secure = production ? "s" : ""

axios.defaults.validateStatus = (status) => status >= 200 && status < 500
axios.defaults.baseURL = `http${secure}://` + serverUri

const socket = io(`http${secure}://` + serverUri, { secure: production, autoConnect: false })
socket.connect()
socket.on("connect", () => {
    console.log("connect")
})
socket.on("disconnect", () => {
    console.log("disconnect")
})

dayjs.extend(isYesterday)
dayjs.extend(isToday)

createRoot(document.getElementById("app")).render(
    createElement(App, {
        socket
    })
)
