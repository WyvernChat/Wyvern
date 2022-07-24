import crypto from "crypto"
import http from "http"
import { Server } from "socket.io"
import { getTextChannel } from "./datamanager"
import { Message, TextChannel } from "./globals"
import { database } from "./server"

function initSockets(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3001", "https://wyvern.tkdkid1000.net"]
        }
    })

    let onlineUsers = []

    io.on("connection", (socket) => {
        const id = database.data.users.find((u) => u.token === socket.handshake.auth.token).id
        if (!id) {
            console.log(id)
            socket.disconnect()
            return
        }
        if (!onlineUsers.includes(id)) onlineUsers.push(id)
        socket.data.userid = id

        socket.on("join guild room", (data) => {
            if (!socket.rooms.has(data.guild)) {
                const guild = database.data.guilds.find((g) => g.id === data.guild)
                if (guild) {
                    if (guild.members.includes(socket.data.userid)) {
                        socket.join(data.guild)
                    }
                }
            }
        })
        socket.on("leave guild room", (data) => {
            socket.leave(data.guild)
        })
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
                    const index = channel.messages.findIndex((m) => m.id === data.previous)
                    const messages = channel.messages.slice(index - 50, index - 1)
                    socket.emit("retrieve channel messages", {
                        messages,
                        finished: messages.length < 49
                    })
                }
            }
        })
        socket.on("leave chat channel", (data) => {
            socket.leave(data.channel)
        })
        socket.on("fetch guild users", (data) => {
            const guild = database.data.guilds.find((g) => g.id === data.guildId)
            socket.emit("send guild users", {
                members: guild.members.map((user) => ({
                    user,
                    online: onlineUsers.includes(user)
                }))
            })
        })
        socket.on("save channel changes", (data) => {
            const channel = database.data.guilds
                .find((g) => g.id === data.guildId)
                .channels.find((c) => c.id === data.channelId) as TextChannel
            if (channel) {
                channel.name = data.changes.name
                channel.description = data.changes.description
                channel.slowmode = data.changes.slowmode
                console.log(channel)
                console.log(socket.rooms.has(data.guildId))
                io.to(data.guildId).emit("update channel", {
                    channelId: channel.id,
                    guildId: data.guildId,
                    changes: {
                        name: channel.name,
                        description: channel.description,
                        slowmode: channel.slowmode
                    }
                })
            }
        })
        socket.on("voice packet", (data) => {
            console.log(data)
            socket.broadcast.emit("voice packet", data)
        })
        socket.on("disconnect", () => {
            onlineUsers = onlineUsers.filter((u) => u === socket.data.userid)
        })
    })

    return io
}

export { initSockets }
