import axios from "axios"
import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"
import { createElement } from "react"
import { createRoot } from "react-dom/client"
import { io } from "socket.io-client"
import { App } from "./App"
import "./scss/main.scss"

const serverUrl = "https://wyvern-api.tkdkid1000.net"

axios.defaults.validateStatus = (status) => status >= 200 && status < 500
axios.defaults.baseURL = serverUrl

const socket = io(serverUrl)

dayjs.extend(isYesterday)
dayjs.extend(isToday)

createRoot(document.getElementById("app")).render(createElement(App))

export { socket }
