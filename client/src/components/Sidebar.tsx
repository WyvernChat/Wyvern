import { Modal } from "@restart/ui"
import axios from "axios"
import React, { useState } from "react"
import { FaPlusCircle } from "react-icons/fa"
import { useParams } from "react-router-dom"
import { useGlobalState } from "../App"
import { Guild } from "../globals"
import logoUrl from "../img/wyvern.svg"
import { useAlert } from "./Alerts"
import Button from "./ui/Button"
import LinkButton from "./ui/LinkButton"
import { Tooltip } from "./ui/Tooltip"

type SidebarProps = {
    hide: boolean
}

const Sidebar = ({ hide }: SidebarProps) => {
    const [guilds] = useGlobalState("guilds")
    const [isGuildModalOpen, setGuildModalOpen] = useState(false)
    const { guildId } = useParams()

    return (
        <>
            <div className={`ServerList ${hide ? "none" : ""}`}>
                <Tooltip placement="right" text={<b>Home</b>}>
                    <LinkButton
                        to="/channels/@me"
                        className="SidebarButton WyvernSidebarButton outlined"
                    >
                        <img
                            src={logoUrl}
                            style={{
                                width: "75%",
                                height: "75%"
                            }}
                        />
                    </LinkButton>
                </Tooltip>
                <hr />
                {guilds.map((guild: Guild) => (
                    <Tooltip key={guild.id} placement="right" text={<b>{guild.name}</b>}>
                        <LinkButton
                            to={`/channels/${guild.id}`}
                            className={`SidebarButton ServerSidebarIcon outlined ${
                                guildId === guild.id ? "active" : ""
                            }`}
                        >
                            <GuildIcon guild={guild} />
                        </LinkButton>
                    </Tooltip>
                ))}
                <Tooltip placement="right" text={<b>Add a Server</b>}>
                    <button
                        className="SidebarButton JoinSidebarButton outlined"
                        onClick={() => setGuildModalOpen(true)}
                    >
                        <FaPlusCircle />
                    </button>
                </Tooltip>
            </div>
            <GuildModal open={isGuildModalOpen} hide={() => setGuildModalOpen(false)} />
        </>
    )
}

function GuildModal(props: { open: boolean; hide: () => void }) {
    const [token] = useGlobalState("token")
    const [modal, setModal] = useState(0)
    const [guildName, setGuildName] = useState("")
    const [invite, setInvite] = useState<string>("")
    const alert = useAlert()

    const createGuild = () => {
        const result = axios.post(
            "/api/guilds/create",
            {
                guildName: guildName
            },
            {
                headers: {
                    authorization: token
                }
            }
        )
        result.then((response) => {
            alert({
                text: `Created server ${guildName}!`,
                type: "success"
            })
            setInvite(response.data.invite)
            // TODO: handle new server with events
            setModal(3)
        })
    }
    const hide = () => {
        props.hide()
        setModal(0)
    }
    return (
        <Modal
            show={props.open}
            onHide={hide}
            className="Modal"
            renderBackdrop={(props) => <div {...props} className="ModalBackground" />}
        >
            <>
                {modal === 0 && (
                    <div className="FadeTransition">
                        <div>
                            <h2>Create a Server</h2>
                        </div>
                        <div>
                            <div className="VStack-3">
                                A server is where you talk and chat with multiple people inside
                                Wyvern.
                                <Button variant="primary" onClick={() => setModal(1)}>
                                    Create Your Own
                                </Button>
                            </div>
                        </div>
                        <div>
                            Have an invite already?
                            <Button variant="secondary" onClick={() => setModal(2)}>
                                Join a Server
                            </Button>
                        </div>
                    </div>
                )}
                {modal === 1 && (
                    <div className="FadeTransition">
                        <div>
                            <h2>Setup your Server</h2>
                        </div>
                        <div>
                            <p>
                                Set your server name here, it can always be changed in the server
                                settings.
                            </p>
                            <div className="Input-Form">
                                <div>Server Name</div>
                                <input
                                    type="text"
                                    value={guildName}
                                    onChange={(e) => setGuildName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="justify-content-between">
                            <Button variant="secondary" onClick={() => setModal(0)}>
                                Back
                            </Button>
                            <Button
                                variant="success"
                                disabled={guildName.length < 1}
                                onClick={createGuild}
                            >
                                Create Server
                            </Button>
                        </div>
                    </div>
                )}
                {modal === 2 && (
                    <div className="FadeTransition">
                        <div>
                            <h2>Join a Server</h2>
                        </div>
                        <div>
                            <p className="text-center">Enter an invite to join a server</p>
                            <div className="VStack-3">
                                <div className="Input-Form">
                                    <div>Server Invite</div>
                                    <input
                                        type="text"
                                        value={invite}
                                        onChange={(e) => setInvite(e.target.value)}
                                        placeholder={"https://Wyvern.tkdkid1000.net/invite/abcdef"}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="justify-content-between">
                            <Button variant="secondary" onClick={() => setModal(0)}>
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    axios
                                        .post(
                                            `/api/guilds/invites/${invite}/join`,
                                            {},
                                            {
                                                headers: {
                                                    authorization: token
                                                }
                                            }
                                        )
                                        .then((response) => {
                                            console.log(response.data)
                                            if (response.status === 201) {
                                                alert({
                                                    text: `Joined guild ${response.data.name}`,
                                                    type: "success"
                                                })
                                            } else if (response.status == 200) {
                                                alert({
                                                    text: "You are already in this guild!",
                                                    type: "primary"
                                                })
                                            } else {
                                                alert({
                                                    text: response.data.error,
                                                    type: "danger"
                                                })
                                            }
                                        })
                                }}
                                disabled={invite.length < 1}
                            >
                                Join Server
                            </Button>
                        </div>
                    </div>
                )}
                {modal === 3 && (
                    <div className="FadeTransition">
                        <div>
                            <h2>Invite People</h2>
                        </div>
                        <div>
                            <div className="VStack-3">
                                <div className="Input-Form">
                                    <input
                                        type="text"
                                        value={invite}
                                        onChange={(e) => setInvite(e.target.value)}
                                        disabled
                                    />
                                </div>
                                <Button variant="primary">Copy</Button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </Modal>
    )
}

function GuildIcon(props: { guild: Guild }) {
    return (
        <span>
            {props.guild.name
                ?.split(" ")
                .map((w) => (w ? w[0] : ""))
                .join("")}
        </span>
    )
}

export default Sidebar
