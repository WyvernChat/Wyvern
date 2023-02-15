import { Button as RestartButton, Dropdown, Modal } from "@restart/ui"
import axios from "axios"
import React, { useState } from "react"
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
import { useGuild, useGuildChannels } from "../../hooks/guild"
import logoUrl from "../../img/logos/WyvernLogoGrayscale-512x512.png"
import menuClasses from "../../scss/ui/contextmenu.module.scss"
import modalClasses from "../../scss/ui/modal.module.scss"
import { useAlert } from "../Alerts"
import Button from "../ui/Button"
import { ContextMenu, ContextMenuButton } from "../ui/ContextMenu"
import TextInput from "../ui/TextInput"
import { Tooltip } from "../ui/Tooltip"
import { MobileView } from "./Guild"

type ChannelsProps = {
    guildId: string
    hide?: boolean
    setView?: (view: MobileView) => void
}

const Channels = ({ guildId, hide, setView }: ChannelsProps) => {
    const [user] = useGlobalState("user")
    const guild = useGuild(guildId)
    const [channelCreate, setChannelCreate] = useState(false)
    const alert = useAlert()
    const channels = useGuildChannels(guildId)

    return (
        <div className="GuildBar" style={{ display: hide && "none" }}>
            <Dropdown>
                <Dropdown.Toggle>
                    {(props, { show }) => (
                        <RestartButton
                            as="div"
                            className={`GuildMenu ${show ? "active" : ""}`}
                            {...props}
                        >
                            <div className="name">{guild?.name}</div>
                            <div className="icon FadeTransition">
                                {show ? <FaWindowClose /> : <FaAngleDown />}
                            </div>
                        </RestartButton>
                    )}
                </Dropdown.Toggle>
                <Dropdown.Menu offset={[0, 0]} usePopper={false}>
                    {({ style, ...props }, { show }) => (
                        <div
                            className={`${menuClasses.menuitems}`}
                            style={{
                                ...style,
                                transition: "visibility 300ms, opacity 300ms",
                                visibility: show ? "visible" : "hidden",
                                opacity: show ? 1 : 0,
                                translate: "-50% 0",
                                left: "50%",
                                top: "50px",
                                width: "90%",
                                position: "absolute"
                            }}
                            {...props}
                        >
                            <ContextMenuButton
                                onClick={() => {
                                    alert({
                                        text: "Copied invite!",
                                        type: "success"
                                    })
                                    navigator.clipboard.writeText(guild.invites[0])
                                }}
                                color="purple"
                                dropdown
                            >
                                Copy Invite
                            </ContextMenuButton>
                            {user?.id === guild?.owner && (
                                <ContextMenuButton
                                    onClick={() => {
                                        setChannelCreate(true)
                                    }}
                                    color="gray"
                                    dropdown
                                >
                                    Create Channel
                                </ContextMenuButton>
                            )}
                        </div>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            <ContextMenu
                buttons={
                    <>
                        <ContextMenuButton onClick={() => {}}>Create Channel</ContextMenuButton>
                        <ContextMenuButton onClick={() => {}} color="purple">
                            Invite
                        </ContextMenuButton>
                    </>
                }
            >
                <div className="ChannelsList">
                    {channels.map((channel, index) => (
                        <ChannelLink
                            key={index}
                            guildId={guildId}
                            channelId={channel.id}
                            setView={setView}
                        />
                    ))}
                </div>
            </ContextMenu>
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
                guildId={guildId}
            />
        </div>
    )
}

function CreateChannelMenu(props: { open: boolean; hide: () => void; guildId: string }) {
    const [token] = useGlobalState("token")
    const [channelName, setChannelName] = useState("")
    return (
        <Modal
            enforceFocus
            autoFocus
            show={props.open}
            onHide={props.hide}
            className={modalClasses.modal}
            renderBackdrop={(props) => <div {...props} className={modalClasses.background} />}
        >
            <>
                <div className={modalClasses.content}>
                    <h2 className="text-center">Create Text Channel</h2>
                    <div className="Input-Form">
                        <TextInput.Label>Channel Name</TextInput.Label>
                        <TextInput
                            type="text"
                            value={channelName}
                            fill
                            onChange={(e) =>
                                setChannelName(
                                    (e.target as HTMLInputElement).value
                                        .toLowerCase()
                                        .replace(/[\s-]+/g, "-")
                                )
                            }
                        />
                    </div>
                </div>
                <div className={modalClasses.footer}>
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

type ChannelLinkProps = {
    guildId: string
    channelId: string
    setView: (view: MobileView) => void
}

function ChannelLink({ guildId, channelId, setView }: ChannelLinkProps) {
    const navigate = useNavigate()
    const params = useParams()
    const [editor, setEditor] = useState(false)

    const [channel] = useChannel(channelId)

    return (
        <>
            <ContextMenu
                buttons={
                    <>
                        <ContextMenuButton onClick={() => {}}>Edit Channel</ContextMenuButton>
                        <ContextMenuButton onClick={() => {}} color="purple">
                            Share
                        </ContextMenuButton>
                        <ContextMenuButton onClick={() => {}} color="red">
                            Delete Channel
                        </ContextMenuButton>
                    </>
                }
            >
                <RestartButton
                    as="div"
                    className={`ChannelLink ${params.channelId === channel?.id ? "active" : ""}`}
                    onClick={() => {
                        setView("chat")
                        console.log("chat")
                        navigate(`/channels/${guildId}/${channel?.id}`)
                    }}
                >
                    <div className="first">
                        <span className="type">
                            {/* todo: when adding voice channels, use <FaMicrophone /> */}
                            <FaHashtag />
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
                </RestartButton>
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

export default Channels
