import { Server as HttpServer } from "http"
import { Server, Socket } from "socket.io"
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
                socket.rooms.add(user.id)
                user.guilds.forEach((g) => socket.rooms.add(g))
            }
        })

        // what follows is subject to, and 100% has to, change soon
        // socket.on("join guild room", async (data) => {
        //     if (!socket.rooms.has(data.guild)) {
        //         const guild = await GuildModel.findOne({
        //             id: data.guild
        //         })
        //         if (guild) {
        //             if (guild.members.includes(socket.data.userid)) {
        //                 socket.join(data.guild)
        //             }
        //         }
        //     }
        // })
        // socket.on("leave guild room", (data) => {
        //     socket.leave(data.guild)
        // })
        // socket.on("MESSAGE_CREATE", async (data) => {
        //     if (socket.rooms.has(data.guild)) {
        //         const author = await UserModel.findOne({
        //             id: socket.data.userId
        //         })
        //         const message = {
        //             id: cuid(),
        //             author: author.id,
        //             content: data.message,
        //             sent: Date.now()
        //         } as Message
        //         data.id = cuid()
        //         io.to(data.channel).emit("chat message", message)

        //         const channel = await TextChannelModel.findOne({
        //             id: data.channel
        //         })
        //         await channel.updateOne({
        //             $push: {
        //                 messages: message
        //             }
        //         })
        //     }
        // })
        // socket.on("join chat channel", async (data) => {
        //     if (!socket.rooms.has(data.channel)) {
        //         const channel = await TextChannelModel.findOne({
        //             id: data.channel
        //         })
        //         if (channel) {
        //             const guild = await GuildModel.findOne({
        //                 id: data.guild
        //             })
        //             if (guild.members.includes(data.user)) {
        //                 socket.join(data.channel)
        //                 let messages = channel.messages
        //                 messages = messages.slice(-Math.min(50, messages.length - 1))
        //                 socket.emit("initial chat messages", {
        //                     messages,
        //                     channel: data.channel
        //                 })
        //             } else {
        //                 socket.emit("kick from chat")
        //             }
        //         }
        //     }
        // })
        // socket.on("retrieve channel messages", async (data) => {
        //     if (socket.rooms.has(data.channel)) {
        //         const channel = await TextChannelModel.findOne({
        //             id: data.channel
        //         })
        //         if (channel) {
        //             const index = channel.messages.findIndex((m) => m.id === data.previous)
        //             const messages = channel.messages.slice(index - 50, index - 1)
        //             socket.emit("retrieve channel messages", {
        //                 messages,
        //                 finished: messages.length < 49
        //             })
        //         }
        //     }
        // })
        // socket.on("leave chat channel", (data) => {
        //     socket.leave(data.channel)
        // })
        // socket.on("fetch guild users", async (data) => {
        //     const guild = await GuildModel.findOne({
        //         id: data.guildId
        //     })
        //     if (guild) {
        //         socket.emit("send guild users", {
        //             members: guild.members.map((user) => ({
        //                 user,
        //                 online: !!connectedClients.find((c) => c.data.userId)
        //             }))
        //         })
        //     }
        // })
    })

    return io
}

export { initSockets }
