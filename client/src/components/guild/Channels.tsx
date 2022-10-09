import { Modal } from "@restart/ui"
import axios from "axios"
import React, { useRef, useState } from "react"
import {
    FaAngleDown,
    FaCog,
    FaHashtag,
    FaHeadphones,
    FaMicrophone,
    FaWindowClose
} from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { useGlobalState } from "../../App"
import { useChannel } from "../../hooks/channel"
import logoUrl from "../../img/logos/WyvernLogoGrayscale-512x512.png"
import { useAlert } from "../Alerts"
import { Button } from "../ui/Button"
import { ContextMenu, ContextMenuButton } from "../ui/ContextMenu"
import { Tooltip } from "../ui/Tooltip"

export function Channels(props: { guildId: string }) {
    const [user] = useGlobalState("user")
    const [guilds] = useGlobalState("guilds")
    const [menuOpen, setMenuOpen] = useState(false)
    const [channelCreate, setChannelCreate] = useState(false)
    const actionRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const alert = useAlert()

    const guild = guilds.find((g) => g.id === props.guildId)

    return (
        <div className="GuildBar">
            <div
                className={`GuildMenu ${menuOpen ? "active" : ""}`}
                ref={actionRef}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <div className="name">{guild?.name}</div>
                <div className="icon FadeTransition">
                    {menuOpen ? <FaWindowClose /> : <FaAngleDown />}
                </div>
            </div>
            <div ref={menuRef} className={`Menu ${menuOpen ? "show" : "hide"}`}>
                <div className="ContextMenu">
                    <ContextMenuButton
                        onClick={() => {
                            alert({
                                text: "Copied invite!",
                                type: "success"
                            })
                            navigator.clipboard.writeText(guild.invites[0])
                        }}
                        color="blue"
                    >
                        Copy Invite
                    </ContextMenuButton>
                    {user?.id === guild?.owner && (
                        <ContextMenuButton
                            onClick={() => {
                                setChannelCreate(true)
                            }}
                            color="gray"
                        >
                            Create Channel
                        </ContextMenuButton>
                    )}
                </div>
            </div>
            <div className="ChannelsList">
                {guild?.channels.map((channelId, index) => (
                    <ChannelLink key={index} guildId={props.guildId} channelId={channelId} />
                ))}
            </div>
            <div className="User-Card">
                <div className="first">
                    <img src={logoUrl} className="avatar" />
                    <div className="user">
                        <div className="username">{user?.username}</div>
                        <div className="hover-container">
                            <div className={`uc-tag`}>#{user?.tag}</div>
                            <div className={`uc-status`}>
                                This is the demo status. You need to add this feature.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    <Tooltip text={<span>Mute</span>} placement="top">
                        <button>
                            <FaMicrophone size={16} />
                        </button>
                    </Tooltip>
                    <Tooltip text={<span>Deafen</span>} placement="top">
                        <button>
                            <FaHeadphones size={16} />
                        </button>
                    </Tooltip>
                    <Tooltip text={<span>User Settings</span>} placement="top">
                        <button>
                            <FaCog size={16} />
                        </button>
                    </Tooltip>
                </div>
            </div>
            <CreateChannelMenu
                open={channelCreate}
                hide={() => setChannelCreate(false)}
                guildId={props.guildId}
            />
        </div>
    )
}

function CreateChannelMenu(props: { open: boolean; hide: () => void; guildId: string }) {
    const [token] = useGlobalState("token")
    const [channelName, setChannelName] = useState("")
    return (
        <Modal show={props.open} onHide={props.hide} centered>
            <>
                <div>
                    <h2>Create Text Channel</h2>
                </div>
                <div>
                    <div className="Input-Form">
                        <div>Channel Name</div>
                        <input
                            type="text"
                            placeholder="general"
                            value={channelName}
                            onChange={(e) =>
                                setChannelName(e.target.value.toLowerCase().replace(" ", "-"))
                            }
                        />
                    </div>
                </div>
                <div>
                    <Button
                        variant="primary"
                        disabled={channelName.length < 1}
                        onClick={() => {
                            axios.post(
                                `/api/guilds/${props.guildId}/channels`,
                                {
                                    name: channelName
                                },
                                {
                                    headers: {
                                        authorization: token
                                    }
                                }
                            )
                            props.hide()
                        }}
                    >
                        Create Channel
                    </Button>
                </div>
            </>
        </Modal>
    )
}

function ChannelLink(props: { guildId: string; channelId: string }) {
    const navigate = useNavigate()
    const params = useParams()
    const [editor, setEditor] = useState(false)

    const [channel] = useChannel(props.channelId)

    return (
        <>
            <ContextMenu
                buttons={
                    <>
                        {/* <ContextMenuButton onClick={() => {}}>Edit Channel</ContextMenuButton>
                        <ContextMenuButton onClick={() => {}} color="blue">
                            Share
                        </ContextMenuButton>
                        <ContextMenuButton onClick={() => {}} color="red">
                            Delete Channel
                        </ContextMenuButton> */}
                    </>
                }
            >
                <div
                    className={`ChannelLink ${params.channelId === channel?.id ? "active" : ""}`}
                    onClick={() => navigate(`/channels/${props.guildId}/${channel?.id}`)}
                >
                    <div className="first">
                        <span className="type">
                            {channel?.type === "TEXT" ? <FaHashtag /> : <FaMicrophone />}
                        </span>
                        <span className="name">{channel?.name}</span>
                    </div>
                    <div>
                        <Tooltip placement="top" text={<b>Edit Channel</b>}>
                            <span className="settings" onClick={() => setEditor(true)}>
                                <FaCog />
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </ContextMenu>
            {/* <ChannelEditor
                guildId={props.guild}
                channelId={props.channel.id}
                open={editor}
                onHide={() => setEditor(false)}
            /> */}
        </>
    )
}
