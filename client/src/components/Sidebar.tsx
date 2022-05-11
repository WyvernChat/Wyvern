import axios from "axios"
import React, { useEffect, useState } from "react"
import { Button, Modal, OverlayTrigger, Stack, Tooltip } from "react-bootstrap"
import { FaPlusCircle } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { useGlobalState } from "../App"
import { getUserData } from "../usermanagement"
import { useAlert } from "./Alerts"

export function Sidebar() {
    const [user] = useGlobalState("user")
    const [isGuildModalOpen, setGuildModalOpen] = useState(false)
    const navigate = useNavigate()
    const { guildId } = useParams()

    return (
        <>
            <div className="ServerList">
                <OverlayTrigger
                    placement="right"
                    overlay={
                        <Tooltip>
                            <b>Home</b>
                        </Tooltip>
                    }
                >
                    <button
                        className="SidebarButton WyvernButton outlined"
                        onClick={() => navigate("/channels/@me")}
                    >
                        <img
                            src="/img/logos/WyvernLogoGrayscale-512x512.png"
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                        />
                    </button>
                </OverlayTrigger>
                <hr />
                {user &&
                    user.guilds.map((guild: string, index: number) => (
                        <OverlayTrigger
                            key={index}
                            placement="right"
                            overlay={
                                <Tooltip>
                                    <b>
                                        <GuildName id={guild} />
                                    </b>
                                </Tooltip>
                            }
                        >
                            <button
                                className={`SidebarButton ServerIcon outlined ${
                                    guildId === guild ? "active" : ""
                                }`}
                                onClick={() =>
                                    guildId !== guild ? navigate(`/channels/${guild}`) : false
                                }
                            >
                                <GuildIcon id={guild} />
                            </button>
                        </OverlayTrigger>
                    ))}
                <OverlayTrigger
                    placement="right"
                    overlay={
                        <Tooltip>
                            <b>Add a Server</b>
                        </Tooltip>
                    }
                >
                    <button
                        className="SidebarButton JoinButton outlined"
                        onClick={() => setGuildModalOpen(true)}
                    >
                        <FaPlusCircle />
                    </button>
                </OverlayTrigger>
            </div>
            <GuildModal open={isGuildModalOpen} hide={() => setGuildModalOpen(false)} />
        </>
    )
}

function GuildModal(props: { open: boolean; hide: () => void }) {
    const [token] = useGlobalState("token")
    const [, setUser] = useGlobalState("user")
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
            getUserData(token).then(setUser)
            setModal(3)
        })
    }
    const hide = () => {
        props.hide()
        setModal(0)
    }
    return (
        <Modal show={props.open} onHide={hide} centered>
            {modal === 0 && (
                <div className="FadeTransition">
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Server</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Stack gap={3}>
                            A server is where you talk and chat with multiple people inside Wyvern.
                            <Button variant="primary" onClick={() => setModal(1)}>
                                Create Your Own
                            </Button>
                        </Stack>
                    </Modal.Body>
                    <Modal.Footer>
                        Have an invite already?
                        <Button variant="secondary" onClick={() => setModal(2)}>
                            Join a Server
                        </Button>
                    </Modal.Footer>
                </div>
            )}
            {modal === 1 && (
                <div className="FadeTransition">
                    <Modal.Header closeButton>
                        <Modal.Title>Setup your Server</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                    </Modal.Body>
                    <Modal.Footer className="justify-content-between">
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
                    </Modal.Footer>
                </div>
            )}
            {modal === 2 && (
                <div className="FadeTransition">
                    <Modal.Header closeButton>
                        <Modal.Title>Join a Server</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-center">Enter an invite to join a server</p>
                        <Stack gap={3}>
                            <div className="Input-Form">
                                <div>Server Invite</div>
                                <input
                                    type="text"
                                    value={invite}
                                    onChange={(e) => setInvite(e.target.value)}
                                    placeholder={"https://Wyvern.tkdkid1000.net/invite/abcdef"}
                                />
                            </div>
                        </Stack>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-between">
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
                    </Modal.Footer>
                </div>
            )}
            {modal === 3 && (
                <div className="FadeTransition">
                    <Modal.Header closeButton>
                        <Modal.Title>Invite People</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Stack gap={3}>
                            <div className="Input-Form">
                                <input
                                    type="text"
                                    value={invite}
                                    onChange={(e) => setInvite(e.target.value)}
                                    disabled
                                />
                            </div>
                            <Button variant="primary">Copy</Button>
                        </Stack>
                    </Modal.Body>
                </div>
            )}
        </Modal>
    )
}

function GuildName(props: { id: string }) {
    const [name, setName] = useState("404")
    useEffect(() => {
        axios.get("/api/guilds/" + props.id).then((guild) => {
            setName(guild.data.name)
        })
    }, [])
    return <span>{name}</span>
}

function GuildIcon(props: { id: string }) {
    const [name, setName] = useState("404")
    useEffect(() => {
        axios.get("/api/guilds/" + props.id).then((guild) => {
            setName(guild.data.name)
        })
    }, [])
    return (
        <span>
            {name
                ?.split(" ")
                .map((w) => (w ? w[0] : ""))
                .join("")}
        </span>
    )
}
