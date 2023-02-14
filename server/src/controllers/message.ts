import cuid from "cuid"
import { Message } from "../globals"
import { TextChannelModel } from "../models/channel"
import { UserModel } from "../models/user"
import { io } from "../server"
import { sendNotification } from "./notification"

const parseMentions = (message: string) => message.match(/@([\w\s]*)#(\d{4})/g) || []

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
        content: content.trim(),
        sent: Date.now(),
        channel: channelId
    } as Message

    await channel.updateOne({
        $push: {
            messages: message
        }
    })

    const mentions = await Promise.all(
        parseMentions(message.content)
            .map(async (mention: string) => {
                const [, username, tag] = /@(.*)#(\d{4})/.exec(mention)
                const user = await UserModel.findOne({
                    username,
                    tag
                })
                return user?.id as string
            })
            .filter(Boolean)
    )

    await sendNotification({
        users: mentions,
        payload: {
            body: message.content,
            data: {
                type: "MESSAGE_CREATE",
                guildId: channel.guild,
                channelId: channel.id,
                messageId: message.id
            },
            actions: [
                {
                    action: "REPLY",
                    title: "Reply"
                },
                {
                    action: "OPEN",
                    title: "Open"
                }
            ],
            icon: "/images/WyvernLogo-512x512.png",
            image: "/images/WyvernLogo-512x512.png",
            badge: "/images/WyvernLogo-512x512.png"
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
