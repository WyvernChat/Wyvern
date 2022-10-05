import { Nav, TabPanel, Tabs, useNavItem } from "@restart/ui"
import axios from "axios"
import React, { HTMLProps, useEffect, useState } from "react"
import { FaHashtag, FaPlusCircle } from "react-icons/fa"
import { useGlobalState } from "../../App"
import { TextChannel } from "../../globals"
import { useSocket } from "../SocketIO"

export function ChannelEditor(props: {
    guildId: string
    channelId: string
    open: boolean
    onHide: () => void
}) {
    const [token] = useGlobalState("token")
    const [user] = useGlobalState("user")
    const [channel, setChannel] = useState<TextChannel>(undefined)
    const [tab, setTab] = useState("overview")

    useEffect(() => {
        if (user && props.channelId) {
            axios
                .get(`/api/channels/${props.guildId}/${props.channelId}`, {
                    headers: {
                        authorization: token
                    }
                })
                .then((response) => {
                    setChannel(response.data.channel)
                })
        }
    }, [user, props.channelId, token, props.guildId])
    useEffect(() => {
        window.addEventListener("keyup", (event) => {
            if (event.key === "Escape") {
                props.onHide()
            }
        })
    }, [])
    return (
        <div
            className="SettingsPage"
            style={{
                display: props.open ? "block" : "none"
            }}
        >
            <div className="ChannelEditor">
                <Tabs activeKey={tab} onSelect={(tab) => setTab(tab)}>
                    <div className="Tabbar">
                        <div className="title">
                            <span className="hashtag">
                                <FaHashtag />
                            </span>
                            <span className="name">{channel?.name}</span>
                        </div>
                        <Nav>
                            <Tab eventKey="overview">Overview</Tab>
                            <Tab eventKey="invites">Invites</Tab>
                            <Tab eventKey="delete">Delete Channel</Tab>
                        </Nav>
                    </div>
                    <div className="Editor">
                        <TabPanel eventKey="overview" className="EditorTab">
                            <OverViewPanel
                                channel={channel}
                                onChange={setChannel}
                                guildId={props.guildId}
                            />
                        </TabPanel>
                        <TabPanel eventKey="invites" className="EditorTab">
                            Invites
                        </TabPanel>
                        <TabPanel eventKey="delete" className="EditorTab">
                            Delete Channel
                        </TabPanel>
                    </div>
                    <div className="Close">
                        <div className="CloseIndicator" onClick={props.onHide}>
                            <FaPlusCircle />
                            <div>ESC</div>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}

function OverViewPanel(props: {
    channel: TextChannel
    onChange: (channel: TextChannel) => void
    guildId: string
}) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [slowmode, setSlowmode] = useState(0)
    const [changes, setChanges] = useState(false)
    const socket = useSocket()

    useEffect(() => {
        if (props.channel) {
            setName(props.channel.name)
            setDescription(props.channel.description)
            setSlowmode(props.channel.slowmode)
        }
    }, [props.channel])
    return (
        <div>
            <h3>Overview</h3>
            <div className="Input-Form">
                <div>Channel Name</div>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value.toLowerCase().replace(" ", "-"))
                        setChanges(true)
                    }}
                />
            </div>
            <hr className="separator" />
            <div className="Input-Form">
                <div>Channel Description</div>
                <textarea
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value)
                        setChanges(true)
                    }}
                    rows={2}
                />
            </div>
            <hr className="separator" />
            <div className="Input-Form">
                <div>Slowmode</div>
                <div
                    style={{
                        display: "inline"
                    }}
                >
                    <input
                        type="range"
                        value={slowmode}
                        onChange={(e) => {
                            setSlowmode(parseInt(e.target.value))
                            setChanges(true)
                        }}
                        step={10}
                        min={0}
                        max={100}
                        style={{
                            display: "inline",
                            width: "90%",
                            verticalAlign: "middle"
                        }}
                    />
                    <input
                        type="text"
                        value={slowmode === 0 ? "Off" : slowmode}
                        disabled
                        style={{
                            display: "inline",
                            width: "10%"
                        }}
                    />
                </div>
            </div>

            <hr className="separator" />
            <div className={`Unsaved ${changes ? "in" : "out"}`}>
                You have unsaved changes!{" "}
                <span
                    style={{
                        float: "right"
                    }}
                >
                    <button
                        className="ResetButton"
                        onClick={() => {
                            if (props.channel) {
                                setName(props.channel.name)
                                setDescription(props.channel.description)
                                setSlowmode(props.channel.slowmode)
                                setChanges(false)
                            }
                        }}
                    >
                        Reset
                    </button>{" "}
                    <button
                        className="SaveButton"
                        onClick={() => {
                            if (props.channel) {
                                props.onChange({
                                    ...props.channel,
                                    name,
                                    description,
                                    slowmode
                                })
                                setChanges(false)
                                socket.emit("save channel changes", {
                                    channelId: props.channel.id,
                                    guildId: props.guildId,
                                    changes: {
                                        name,
                                        description,
                                        slowmode
                                    }
                                })
                            }
                        }}
                    >
                        Save Changes
                    </button>
                </span>
            </div>
        </div>
    )
}

function Tab(props: { eventKey: any } & HTMLProps<HTMLDivElement>) {
    const { eventKey, ...rest } = props
    const [navItemProps, meta] = useNavItem({
        key: props.eventKey
    })

    return <div {...rest} {...navItemProps} className={`Tab ${meta.isActive ? "active" : ""}`} />
}
