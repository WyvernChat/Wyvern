import crypto from "crypto"
import http from "http"
import { Server } from "socket.io"
import { getTextChannel } from "./datamanager"
import { Message } from "./globals"
import { database } from "./server"

function initSockets(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: true,
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    })

    io.on("connection", (socket) => {
        socket.on("chat message", (data) => {
            if (socket.rooms.has(data.channel)) {
                const author = database.data.users.find((u) => u.id === data.author)
                const message = {
                    id: crypto.randomBytes(16).toString("hex"),
                    author: author.id,
                    content: data.message,
                    sent: Date.now()
                } as Message
                data.id = crypto.randomBytes(16).toString("hex")
                io.to(data.channel).emit("chat message", message)

                getTextChannel(database, data.guild, data.channel)?.messages.push(message)
            }
        })
        socket.on("join chat channel", (data) => {
            if (!socket.rooms.has(data.channel)) {
                const channel = getTextChannel(database, data.guild, data.channel)
                if (channel) {
                    const guild = database.data.guilds.find((g) => g.id === data.guild)
                    if (guild.members.includes(data.user)) {
                        socket.join(data.channel)
                        let messages = channel.messages
                        messages = messages.slice(-Math.min(50, messages.length - 1))
                        socket.emit("initial chat messages", {
                            messages: messages,
                            channel: data.channel
                        })
                    } else {
                        socket.emit("kick from chat")
                    }
                }
            }
        })
        socket.on("retrieve channel messages", (data) => {
            if (socket.rooms.has(data.channel)) {
                const channel = getTextChannel(database, data.guild, data.channel)
                if (channel) {
                    const messages = channel.messages.slice(data.start, data.end)
                    console.log(messages)
                }
            }
        })
        socket.on("leave chat channel", (data) => {
            socket.leave(data.channel)
        })
        socket.on("voice packet", (data) => {
            console.log(data)
            socket.broadcast.emit("voice packet", data)
        })
    })

    return io
}

export { initSockets }
