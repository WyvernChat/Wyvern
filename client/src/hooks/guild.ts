import axios from "axios"
import { useEffect } from "react"
import { useGlobalState } from "../App"
import { Guild } from "../globals"

async function getGuilds(token: string | undefined): Promise<string[] | undefined> {
    if (token) {
        const response = await axios.get(`/api/user/guilds`, {
            headers: {
                authorization: token
            }
        })
        if (response.status === 200) {
            return response.data.guilds
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

const useGuilds = (token: string | undefined) => {
    const [guilds, setGuilds] = useGlobalState("guilds")
    // const socket = useSocket()
    useEffect(() => {
        axios
            .get(`/api/user/guilds`, {
                headers: {
                    authorization: token
                }
            })
            .then(async (res) => {
                if (res.status === 200) {
                    console.log(res.data, res.status)
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
                    setGuilds([...newGuilds])
                    // listen for GUILD_CREATE, GUILD_UPDATE, and GUILD_DELETE here
                }
            })
    }, [token])
    return [guilds]
}

export { getGuilds, useGuilds }
