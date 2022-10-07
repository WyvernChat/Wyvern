import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGuild } from "../../hooks/guild"
import { Root } from "../Root"
import { Channels } from "./Channels"
import { Chat } from "./Chat"
import { Users } from "./Users"

export function Guild() {
    const { guildId, channelId } = useParams()
    const navigate = useNavigate()
    const guild = useGuild(guildId)

    useEffect(() => {
        if (!channelId) {
            navigate(`/channels/${guildId}/${guild.channels[0]}`)
        }
    }, [channelId, guild, guildId, navigate])
    return (
        <Root>
            <Channels guildId={guildId} />
            <Chat guildId={guildId} channelId={channelId} />
            <Users guildId={guildId} />
        </Root>
    )
}
