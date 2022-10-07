import axios from "axios"
import { useEffect } from "react"
import { useGlobalState } from "../App"
import { useSocket } from "../components/SocketIO"
import { Guild } from "../globals"

const useGuild = (guildId: string) => {
    const [guilds] = useGlobalState("guilds")
    const guild = guilds.find((c) => c.id === guildId)
    return guild
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
                        res.data.guilds?.map((guildId: string) =>
                            axios
                                .get(`/api/guilds/${guildId}`, {
                                    headers: {
                                        authorization: token
                                    }
                                })
                                .then((res) => res.data)
                        )
                    )
                    setGuilds((prevGuilds) => [...prevGuilds, ...newGuilds])
                    // todo: listen for GUILD_CREATE, GUILD_UPDATE, and GUILD_DELETE here
                    socket.on("GUILD_CREATE", (guild: Guild) => {
                        setGuilds((prevGuilds) => [...prevGuilds, guild])
                    })
                }
            })
    }, [setGuilds, socket, token])
    return [guilds]
}

export { useGuild, useGuilds }
