import axios from "axios"
import { useEffect } from "react"
import { useGlobalState } from "../App"
import { useSocket } from "../components/SocketIO"
import { Channel, Guild } from "../globals"

const useGuild = (guildId: string) => {
    const [guilds] = useGlobalState("guilds")
    const guild = guilds.find((c) => c.id === guildId)
    return guild
}

const useGuildChannels = (guildId: string) => {
    const [channels] = useGlobalState("channels")
    const guildChannels = channels.filter((c) => c.guild === guildId)
    return guildChannels
}

const useGuilds = (token: string | undefined) => {
    const [guilds, setGuilds] = useGlobalState("guilds")
    const socket = useSocket()
    useEffect(() => {
        axios
            .get(`/api/user/guilds`, {
                headers: {
                    authorization: token
                }
            })
            .then(async (res) => {
                if (res.status === 200) {
                    const newGuilds: Guild[] = await Promise.all(
                        res.data.guilds?.map(async (guildId: string) => {
                            const guild = await axios
                                .get(`/api/guilds/${guildId}`, {
                                    headers: {
                                        authorization: token
                                    }
                                })
                                .then((res) => res.data)
                            guild.channels = await axios
                                .get(`/api/guilds/${guildId}/channels`, {
                                    headers: {
                                        authorization: token
                                    }
                                })
                                .then((res) => res.data)
                                .then(({ channels }: { channels: Channel[] }) =>
                                    channels.map(({ id }) => id)
                                )
                            return guild
                        })
                    )
                    setGuilds((prevGuilds) => [
                        ...prevGuilds,
                        ...newGuilds.filter((c) => !prevGuilds.map(({ id }) => id).includes(c.id))
                    ])
                    // todo: listen for GUILD_CREATE, GUILD_UPDATE, and GUILD_DELETE here
                    socket.on("GUILD_CREATE", (guild: Guild) => {
                        setGuilds((prevGuilds) => [...prevGuilds, guild])
                    })
                }
            })
    }, [setGuilds, socket, token])
    return [guilds]
}

export { useGuild, useGuildChannels, useGuilds }
