import axios from "axios"
import { useCallback, useEffect } from "react"
import { useGlobalState } from "../App"
import { Channel } from "../globals"

const useChannel = (channelId: string) => {
    const [channels] = useGlobalState("channels")
    const channel = channels.find((c) => c.id === channelId)
    return channel
}

const useChannels = (token: string) => {
    const [, setChannels] = useGlobalState("channels")
    const [guilds] = useGlobalState("guilds")
    const fetchChannels = useCallback(async () => {
        for await (const guild of guilds) {
            let newChannels: Channel[] = await Promise.all(
                guild.channels?.map((channelId: string) =>
                    axios
                        .get(`/api/channels/${guild.id}/${channelId}`, {
                            headers: {
                                authorization: token
                            }
                        })
                        .then((res) => res.data.channel)
                )
            )
            newChannels = newChannels.filter(Boolean)
            setChannels((prevChannels) => [...prevChannels, ...newChannels])
        }
    }, [guilds, setChannels, token])
    useEffect(() => {
        fetchChannels()
    }, [fetchChannels])
}

export { useChannel, useChannels }
