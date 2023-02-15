import cuid from "cuid"
import { TextChannelModel } from "../models/channel"
import { GuildModel } from "../models/guild"
import { UserModel } from "../models/user"
import { io } from "../server"

type CreateTextChannelOptions = {
    name: string
    guild: string
}

const createTextChannel = async ({ name, userId, guildId }) => {
    const guild = await GuildModel.findOne({
        id: guildId
    })
    const user = await UserModel.findOne({
        id: userId
    })
    if (!guild.members.includes(user.id) || guild.owner !== user.id)
        throw new Error("Permission denied!") // todo: Add permission check once created
    const channel = await TextChannelModel.create({
        id: cuid(),
        name: name.toLowerCase().replace(/[\s-]+/g, "-"),
        description: "",
        type: "TEXT",
        guild: guild.id,
        messages: [],
        slowmode: 0
    })
    await guild.updateOne({
        $push: {
            channels: channel.id
        }
    })

    const sockets = await io.fetchSockets()
    sockets.forEach((socket) => {
        if (guild.members.includes(socket.data.userId)) {
            socket.emit("CHANNEL_CREATE", channel)
        }
    })

    return channel
}

export type { CreateTextChannelOptions }
export { createTextChannel }
