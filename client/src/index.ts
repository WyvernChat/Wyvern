import axios from "axios"
import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"
import { createElement } from "react"
import { createRoot } from "react-dom/client"
import { io } from "socket.io-client"
import { App } from "./App"
import "./scss/main.scss"

export function Development() {
    const serverUrl = "http://localhost:3000"
    console.log("Loading development server at " + serverUrl)

    axios.defaults.validateStatus = (status) => status >= 200 && status < 500
    axios.defaults.baseURL = serverUrl

    const socket = io(serverUrl)

    dayjs.extend(isYesterday)
    dayjs.extend(isToday)

    createRoot(document.getElementById("app")).render(
        createElement(App, {
            socket: socket
        })
    )
}
