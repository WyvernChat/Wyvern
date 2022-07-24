import axios from "axios"
import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGlobalState } from "../../App"
import { Root } from "../Root"
import { useSocket } from "../SocketIO"
import { Channels } from "./Channels"
import { Chat } from "./Chat"
import { Users } from "./Users"

export function Guild() {
    const [user] = useGlobalState("user")
    const { guildId, channelId } = useParams()
    const navigate = useNavigate()
    const socket = useSocket()

    useEffect(() => {
        if (!channelId) {
            axios.get(`/api/channels/${guildId}/channels`).then((response) => {
                if (response.status === 200) {
                    navigate(`/channels/${guildId}/${response.data.channels[0].id}`)
                }
            })
        }
    }, [channelId])
    useEffect(() => {
        if (user && guildId) {
            socket.emit("join guild room", {
                guild: guildId,
                user: user?.id
            })
        }
        return () => {
            socket.emit("leave guild room", {
                guild: guildId
            })
        }
    }, [user, guildId])
    return (
        <Root>
            <Channels guildId={guildId} />
            <Chat guildId={guildId} channelId={channelId} />
            <Users guildId={guildId} />
        </Root>
    )
}
