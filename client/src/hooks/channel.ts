import axios from "axios"
import { useCallback, useEffect } from "react"
import { useGlobalState } from "../App"
import { useSocketListener } from "../components/SocketIO"
import { Channel } from "../globals"

const useChannel = <T extends Channel>(channelId: string): [T, (channel: T) => void] => {
    const [channels, setChannels] = useGlobalState("channels")
    const channel = <T>channels.find((c) => c.id === channelId)
    const setChannel = useCallback(
        (channel: Channel) => {
            setChannels(channels.map((c) => (c.id === channel.id ? { ...channel } : { ...c })))
        },
        [channels, setChannels]
    )
    return [channel, setChannel]
}

const useChannels = (token: string) => {
    const [, setChannels] = useGlobalState("channels")
    const [guilds] = useGlobalState("guilds")
    const fetchChannels = useCallback(async () => {
        for await (const guild of guilds) {
            let newChannels: Channel[] = await Promise.all(
                guild.channels?.map((channelId: string) =>
                    axios
                        .get(`/api/channels/${channelId}`, {
                            headers: {
                                authorization: token
                            }
                        })
                        .then((res) => res.data.channel)
                )
            )
            newChannels = newChannels.filter(Boolean)
            setChannels((prevChannels) => [
                ...prevChannels,
                ...newChannels.filter((c) => !prevChannels.map(({ id }) => id).includes(c.id))
            ])
        }
    }, [guilds, setChannels, token])
    useEffect(() => {
        fetchChannels()
    }, [fetchChannels])
    useSocketListener("CHANNEL_CREATE", (channel: Channel) => {
        setChannels((prevChannels) => [...prevChannels, channel])
    })
}

export { useChannel, useChannels }
