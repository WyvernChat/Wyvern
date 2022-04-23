import axios from "axios"
import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Root } from "../Root"
import { Channels } from "./Channels"
import { Chat } from "./Chat"
import { Users } from "./Users"

export function Guild() {
    const { guildId, channelId } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (!channelId) {
            axios.get(`/api/channels/${guildId}/channels`).then((response) => {
                if (response.status === 200) {
                    navigate(`/channels/${guildId}/${response.data.channels[0].id}`)
                }
            })
        }
    }, [channelId])
    return (
        <Root>
            <Channels guildId={guildId} />
            <Chat guildId={guildId} channelId={channelId} />
            <Users guildId={guildId} />
        </Root>
    )
}
