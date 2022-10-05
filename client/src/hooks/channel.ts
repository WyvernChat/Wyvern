import axios from "axios"
import { useEffect, useState } from "react"
import { useGlobalState } from "../App"

const useChannel = (channelId: string, guildId: string) => {
    const [channel, setChannel] = useState(undefined)
    const [token] = useGlobalState("token")
    useEffect(() => {
        axios
            .get(`/api/channels/${guildId}/${channelId}`, {
                headers: {
                    authorization: token
                }
            })
            .then((response) => {
                setChannel(response.data.channel)
            })
    }, [channelId, guildId])
    return [channel]
}

export { useChannel }
