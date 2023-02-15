import cuid from "cuid"
import { TextChannelModel } from "../models/channel"
import { GuildModel } from "../models/guild"
import { UserModel } from "../models/user"
import { io } from "../server"

type CreateGuildOptions = {
    owner: string
    name: string
}

const createGuild = async ({ owner, name }: CreateGuildOptions) => {
    const user = await UserModel.findOne({
        id: owner
    })
    const guild = await GuildModel.create({
        id: cuid(),
        name: name.replace(/\s+/gm, " "),
        owner,
        members: [owner],
        invites: [cuid.slug()],
        channels: []
    })
    const channel = await TextChannelModel.create({
        guild: guild.id,
        name: "general",
        description: "",
        type: "TEXT",
        id: cuid()
    })

    await guild.updateOne({
        $push: {
            channels: channel.id
        }
    })
    await user.updateOne({
        $push: {
            guilds: guild.id
        }
    })

    const sockets = await io.fetchSockets()
    sockets.forEach((socket) => {
        if (socket.data.userId === user.id) {
            socket.emit("GUILD_CREATE", guild)
        }
    })

    return guild
}

type JoinGuildOptions = {
    userId: string
    guildId?: string
    invite?: string
}

const joinGuild = async ({ userId, guildId, invite }: JoinGuildOptions) => {
    if (!(invite || guildId)) throw new Error("Guild or invite not specified!")
    const user = await UserModel.findOne({
        id: userId
    })
    const guild = await GuildModel.findOne({
        $or: [
            {
                id: guildId
            },
            {
                invites: invite
            }
        ]
    })
    if (!guild) throw new Error("Guild not found!")
    await user.updateOne({
        $push: {
            guilds: guild.id
        }
    })
    await guild.updateOne({
        $push: {
            members: user.id
        }
    })

    const sockets = await io.fetchSockets()
    sockets.forEach((socket) => {
        if (socket.rooms.has(guild.id)) {
            socket.emit("GUILD_MEMBER_ADD", {
                member: user.id,
                guild: guild.id
            })
        }
        if (socket.data.userId === user.id) {
            socket.emit("GUILD_JOIN", guild)
            socket.join(guild.id)
        }
    })
    return guild
}

export type { CreateGuildOptions, JoinGuildOptions }
export { createGuild, joinGuild }
