import cuid from "cuid"
import { Message } from "../globals"
import { TextChannelModel } from "../models/channel"
import { UserModel } from "../models/user"
import { io } from "../server"

type CreateMessageOptions = {
    content: string
    author: string
    channelId: string
}

const createMessage = async ({ content, author, channelId }: CreateMessageOptions) => {
    const channel = await TextChannelModel.findOne({
        id: channelId
    })
    const user = await UserModel.findOne({
        id: author,
        guilds: channel.guild
    })
    // console.log(content, author, channelId)
    if (!user) throw new Error("User is not in the specified guild!")

    const message = {
        id: cuid(),
        author,
        content,
        sent: Date.now(),
        channel: channelId
    } as Message

    await channel.updateOne({
        $push: {
            messages: message
        }
    })

    const sockets = await io.fetchSockets()
    sockets.forEach((socket) => {
        if (socket.rooms.has(channel.guild)) {
            socket.emit("MESSAGE_CREATE", message)
        }
    })
}

export { CreateMessageOptions, createMessage }
