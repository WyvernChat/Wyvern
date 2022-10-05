import { randomBytes } from "crypto"
import { Server as HttpServer } from "http"
import { Server, Socket } from "socket.io"
import { Message } from "./globals"
import { TextChannelModel } from "./models/channel"
import { GuildModel } from "./models/guild"
import { UserModel } from "./models/user"

function initSockets(server: HttpServer) {
    const io = new Server(server, {
        cors: {
            origin: process.env.ALLOW_ORIGINS.split(",")
        }
    })

    let connectedClients: Socket[] = []

    io.on("connection", async (socket) => {
        // console.log(connectedClients)
        connectedClients.push(socket)

        socket.on("disconnecting", (reason) => {
            // handle disconnecting (client)
        })
        socket.on("disconnect", (reason) => {
            // handle disconnect (server)
            connectedClients = connectedClients.filter((c) => c.id !== socket.id)
        })

        socket.on("IDENTIFY", async ({ token }) => {
            // console.log(token)
            if (typeof token !== "string") return
            const user = await UserModel.findOne({
                token
            })
            if (user) {
                socket.data.userId = user.id
                socket.emit("READY", {
                    user: user
                })
            }
        })
        // what follows is subject to, and 100% has to, change soon
        socket.on("join guild room", async (data) => {
            if (!socket.rooms.has(data.guild)) {
                const guild = await GuildModel.findOne({
                    id: data.guild
                })
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
        socket.on("chat message", async (data) => {
            if (socket.rooms.has(data.channel)) {
                const author = await UserModel.findOne({
                    id: data.author
                })
                const message = {
                    id: randomBytes(16).toString("hex"),
                    author: author.id,
                    content: data.message,
                    sent: Date.now()
                } as Message
                data.id = randomBytes(16).toString("hex")
                io.to(data.channel).emit("chat message", message)

                const channel = await TextChannelModel.findOne({
                    id: data.channel
                })
                await channel.updateOne({
                    $push: {
                        messages: message
                    }
                })
            }
        })
        socket.on("join chat channel", async (data) => {
            if (!socket.rooms.has(data.channel)) {
                const channel = await TextChannelModel.findOne({
                    id: data.channel
                })
                if (channel) {
                    const guild = await GuildModel.findOne({
                        id: data.guild
                    })
                    if (guild.members.includes(data.user)) {
                        socket.join(data.channel)
                        let messages = channel.messages
                        messages = messages.slice(-Math.min(50, messages.length - 1))
                        socket.emit("initial chat messages", {
                            messages,
                            channel: data.channel
                        })
                    } else {
                        socket.emit("kick from chat")
                    }
                }
            }
        })
        socket.on("retrieve channel messages", async (data) => {
            if (socket.rooms.has(data.channel)) {
                const channel = await TextChannelModel.findOne({
                    id: data.channel
                })
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
        socket.on("fetch guild users", async (data) => {
            const guild = await GuildModel.findOne({
                id: data.guildId
            })
            if (guild) {
                socket.emit("send guild users", {
                    members: guild.members.map((user) => ({
                        user,
                        online: !!connectedClients.find((c) => c.data.userId)
                    }))
                })
            }
        })
    })
}

// function initSockets(server: http.Server) {
//     const io = new Server(server, {
//         cors: {
//             origin: ["http://localhost:3001", "https://wyvern.tkdkid1000.net"]
//         }
//     })

//     let onlineUsers = []

//     io.on("connection", (socket) => {
//         const id = database.data.users.find((u) => u.token === socket.handshake.auth.token).id
//         if (!id) {
//             console.log(id)
//             socket.disconnect()
//             return
//         }
//         if (!onlineUsers.includes(id)) onlineUsers.push(id)
//         socket.data.userid = id

//         socket.on("join guild room", (data) => {
//             if (!socket.rooms.has(data.guild)) {
//                 const guild = database.data.guilds.find((g) => g.id === data.guild)
//                 if (guild) {
//                     if (guild.members.includes(socket.data.userid)) {
//                         socket.join(data.guild)
//                     }
//                 }
//             }
//         })
//         socket.on("leave guild room", (data) => {
//             socket.leave(data.guild)
//         })
//         socket.on("chat message", (data) => {
//             if (socket.rooms.has(data.channel)) {
//                 const author = database.data.users.find((u) => u.id === data.author)
//                 const message = {
//                     id: crypto.randomBytes(16).toString("hex"),
//                     author: author.id,
//                     content: data.message,
//                     sent: Date.now()
//                 } as Message
//                 data.id = crypto.randomBytes(16).toString("hex")
//                 io.to(data.channel).emit("chat message", message)

//                 getTextChannel(database, data.guild, data.channel)?.messages.push(message)
//             }
//         })
//         socket.on("join chat channel", (data) => {
//             if (!socket.rooms.has(data.channel)) {
//                 const channel = getTextChannel(database, data.guild, data.channel)
//                 if (channel) {
//                     const guild = database.data.guilds.find((g) => g.id === data.guild)
//                     if (guild.members.includes(data.user)) {
//                         socket.join(data.channel)
//                         let messages = channel.messages
//                         messages = messages.slice(-Math.min(50, messages.length - 1))
//                         socket.emit("initial chat messages", {
//                             messages: messages,
//                             channel: data.channel
//                         })
//                     } else {
//                         socket.emit("kick from chat")
//                     }
//                 }
//             }
//         })
//         socket.on("retrieve channel messages", (data) => {
//             if (socket.rooms.has(data.channel)) {
//                 const channel = getTextChannel(database, data.guild, data.channel)
//                 if (channel) {
//                     const index = channel.messages.findIndex((m) => m.id === data.previous)
//                     const messages = channel.messages.slice(index - 50, index - 1)
//                     socket.emit("retrieve channel messages", {
//                         messages,
//                         finished: messages.length < 49
//                     })
//                 }
//             }
//         })
//         socket.on("leave chat channel", (data) => {
//             socket.leave(data.channel)
//         })
//         socket.on("fetch guild users", (data) => {
//             const guild = database.data.guilds.find((g) => g.id === data.guildId)
//             socket.emit("send guild users", {
//                 members: guild.members.map((user) => ({
//                     user,
//                     online: onlineUsers.includes(user)
//                 }))
//             })
//         })
//         socket.on("save channel changes", (data) => {
//             const channel = database.data.guilds
//                 .find((g) => g.id === data.guildId)
//                 .channels.find((c) => c.id === data.channelId) as TextChannel
//             if (channel) {
//                 channel.name = data.changes.name
//                 channel.description = data.changes.description
//                 channel.slowmode = data.changes.slowmode
//                 console.log(channel)
//                 console.log(socket.rooms.has(data.guildId))
//                 io.to(data.guildId).emit("update channel", {
//                     channelId: channel.id,
//                     guildId: data.guildId,
//                     changes: {
//                         name: channel.name,
//                         description: channel.description,
//                         slowmode: channel.slowmode
//                     }
//                 })
//             }
//         })
//         socket.on("voice packet", (data) => {
//             console.log(data)
//             socket.broadcast.emit("voice packet", data)
//         })
//         socket.on("disconnect", () => {
//             onlineUsers = onlineUsers.filter((u) => u === socket.data.userid)
//         })
//     })

//     return io
// }

export { initSockets }
