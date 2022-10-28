import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGuild } from "../../hooks/guild"
import useResponsive from "../../hooks/responsive"
import Root from "../Root"
import Channels from "./Channels"
import Chat from "./Chat"
import Users from "./Users"

type MobileView = "channels" | "chat" | "users"

const Guild = () => {
    const { guildId, channelId } = useParams()
    const navigate = useNavigate()
    const guild = useGuild(guildId)
    const isDesktop = useResponsive("md")
    const [view, setView] = useState<MobileView>("channels")

    useEffect(() => {
        if (!channelId) {
            navigate(`/channels/${guildId}/${guild.channels[0]}`)
        }
    }, [channelId, guild, guildId, navigate])
    return (
        <Root hideGuilds={!isDesktop && view !== "channels"}>
            <Channels
                guildId={guildId}
                hide={!isDesktop && view !== "channels"}
                setView={setView}
            />
            <Chat channelId={channelId} hide={!isDesktop && view !== "chat"} setView={setView} />
            <Users guildId={guildId} hide={!isDesktop && view !== "users"} />
        </Root>
    )
}

export type { MobileView }
export default Guild
