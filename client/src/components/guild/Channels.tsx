import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import { FaAngleDown, FaHashtag, FaMicrophone, FaWindowClose } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { useGlobalState } from "../../App"
import { Channel, Guild } from "../../globals"
import { useAlert } from "../Alerts"
import { ContextMenu, ContextMenuButton } from "../ui/ContextMenu"

export function Channels(props: { guildId: string }) {
    const [user] = useGlobalState("user")
    const [guild, setGuild] = useState<Guild>(undefined)
    const [invites, setInvites] = useState<string[]>(undefined)
    const [channels, setChannels] = useState<Channel[]>([])
    const [menuOpen, setMenuOpen] = useState(false)
    const [channelCreate, setChannelCreate] = useState(false)
    const actionRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const alert = useAlert()

    useEffect(() => {
        axios.get(`/api/guilds/${props.guildId}`).then((response) => {
            if (response.status === 200) {
                setGuild(response.data)
            }
        })
        axios
            .get(`/api/guilds/${props.guildId}/invites`, {
                headers: {
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setInvites(res.data.invites)
                }
            })
        axios.get(`/api/channels/${props.guildId}/channels`).then((response) => {
            if (response.status === 200) {
                setChannels(response.data.channels)
            }
        })
    }, [props.guildId])
    return (
        <div className="GuildBar">
            <div
                className={`GuildMenu ${menuOpen ? "active" : ""}`}
                ref={actionRef}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <div>
                    <span className="name">{guild?.name}</span>
                    <span className="icon FadeTransition">
                        {menuOpen ? <FaWindowClose /> : <FaAngleDown />}
                    </span>
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
                            navigator.clipboard.writeText(invites[0])
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
                {channels.map((channel, index) => (
                    <ChannelLink key={index} guild={props.guildId} channel={channel} />
                ))}
            </div>
            <div className="User-Card">
                <img src="/img/logos/WyvernLogoGrayscale-512x512.png" className="avatar" />
                <div>
                    <div className="username">{user?.username}</div>
                    <div className="tag">#{user?.tag}</div>
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
    const [channelName, setChannelName] = useState("")
    return (
        <Modal show={props.open} onHide={props.hide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create Text Channel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    disabled={channelName.length < 1}
                    onClick={() => {
                        axios.post(
                            `/api/guilds/${props.guildId}/createChannel`,
                            {
                                name: channelName
                            },
                            {
                                headers: {
                                    authorization: sessionStorage.getItem("token")
                                }
                            }
                        )
                        props.hide()
                    }}
                >
                    Create Channel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function ChannelLink(props: { guild: string; channel: Channel }) {
    const navigate = useNavigate()
    const { channelId } = useParams()

    return (
        <ContextMenu
            buttons={
                <>
                    <ContextMenuButton onClick={() => {}}>Edit Channel</ContextMenuButton>
                    <ContextMenuButton onClick={() => {}} color="blue">
                        Share
                    </ContextMenuButton>
                    <ContextMenuButton onClick={() => {}} color="red">
                        Delete Channel
                    </ContextMenuButton>
                </>
            }
        >
            <div
                className={`ChannelLink ${channelId === props.channel.id ? "active" : ""}`}
                onClick={() => navigate(`/channels/${props.guild}/${props.channel.id}`)}
            >
                <span>
                    {props.channel.type === "TEXT" ? <FaHashtag /> : <FaMicrophone />}
                    <span className="name">{props.channel.name}</span>
                </span>
            </div>
        </ContextMenu>
    )
}
