import { Modal } from "@restart/ui"
import axios from "axios"
import React, { CSSProperties, useEffect, useRef, useState } from "react"
import { IoAdd } from "react-icons/io5"
import { useParams } from "react-router-dom"
import { ReactSortable } from "react-sortablejs"
import { useGlobalState } from "../App"
import { Guild } from "../globals"
import logoUrl from "../img/wyvern.svg"
import modalClasses from "../scss/ui/modal.module.scss"
import SortableItem from "../SortableItem"
import { useOnce } from "../utils"
import { useAlert } from "./Alerts"
import Button from "./ui/Button"
import LinkButton from "./ui/LinkButton"
import Stack from "./ui/Stack"
import TextInput from "./ui/TextInput"
import { Tooltip } from "./ui/Tooltip"

type SidebarProps = {
    hide: boolean
}

const Sidebar = ({ hide }: SidebarProps) => {
    const [guilds, setGuilds] = useGlobalState("guilds")
    const [isGuildModalOpen, setGuildModalOpen] = useState(false)
    const { guildId } = useParams()
    const [once, setOnce] = useOnce()

    useEffect(() => {
        const sortKey: string[] = JSON.parse(localStorage.getItem("guilds.sort") || "[]")
        if (!sortKey || guilds.length < 1) return
        if (once) {
            localStorage.setItem("guilds.sort", JSON.stringify([...guilds].map((g) => g.id)))
        } else {
            console.log(guilds, sortKey)
            setGuilds((guilds) =>
                [...guilds].sort((a, b) => sortKey.indexOf(a.id) - sortKey.indexOf(b.id))
            )
            setOnce()
        }
    }, [guilds, once, setGuilds, setOnce])

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

                <ReactSortable list={guilds} setList={setGuilds} animation={200}>
                    {guilds.map((guild: Guild) => (
                        <GuildButton key={guild.id} guild={guild} active={guildId === guild.id} />
                    ))}
                </ReactSortable>
                <Tooltip placement="right" text={<b>Add a Server</b>}>
                    <button
                        className="SidebarButton JoinSidebarButton outlined"
                        onClick={() => setGuildModalOpen(true)}
                    >
                        <IoAdd size={28} />
                    </button>
                </Tooltip>
            </div>
            <GuildModal open={isGuildModalOpen} hide={() => setGuildModalOpen(false)} />
        </>
    )
}

type GuildButtonProps = {
    guild: Guild & SortableItem
    active: boolean
}

const GuildButton = ({ guild, active }: GuildButtonProps) => {
    const ref = useRef<HTMLButtonElement>(null)
    const [moving, setMoving] = useState(false)
    const [down, setDown] = useState(false)

    const style: CSSProperties = {
        opacity: moving && down ? 0.5 : 1
    }

    useEffect(() => {
        if (guild.chosen) return
        setDown(false)
        setMoving(false)
    }, [guild.chosen])

    return (
        <Tooltip placement="right" text={<b>{guild.name}</b>} hide={guild.chosen}>
            <LinkButton
                ref={ref}
                to={`/channels/${guild.id}`}
                style={style}
                className={`SidebarButton ServerSidebarIcon outlined ${active ? "active" : ""} ${
                    moving && down ? "sorting" : ""
                }`}
                onMouseMove={() => down && setMoving(true)}
                onMouseDown={() => setDown(true)}
                onMouseUp={() => {
                    setMoving(false)
                    setDown(false)
                }}
                // data-handler-id={handlerId}
            >
                <GuildIcon guild={guild} />
            </LinkButton>
        </Tooltip>
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
            enforceFocus
            autoFocus
            show={props.open}
            onHide={hide}
            className={modalClasses.modal}
            renderBackdrop={(props) => <div {...props} className={modalClasses.background} />}
        >
            <>
                {modal === 0 && (
                    <div className="FadeTransition">
                        <div className={modalClasses.content}>
                            <h2 className="text-center">Create a Server</h2>
                            <Stack size={3} className="text-center">
                                <div className="text-center">
                                    A server is where you talk and chat with multiple people inside
                                    Wyvern.
                                </div>
                                <Button variant="primary" onClick={() => setModal(1)}>
                                    Create Your Own
                                </Button>
                            </Stack>
                        </div>
                        <div className={modalClasses.footer}>
                            Have an invite already?
                            <Button variant="dark" onClick={() => setModal(2)}>
                                Join a Server
                            </Button>
                        </div>
                    </div>
                )}
                {modal === 1 && (
                    <div className="FadeTransition">
                        <div className={modalClasses.content}>
                            <h2 className="text-center">Setup your Server</h2>
                            <p className="text-center">
                                Set your server name here, it can always be changed in the server
                                settings.
                            </p>
                            <div className="Input-Form">
                                <TextInput.Label>Server Name</TextInput.Label>
                                <TextInput
                                    type="text"
                                    value={guildName}
                                    fill
                                    onChange={(e) =>
                                        setGuildName((e.target as HTMLInputElement).value)
                                    }
                                />
                            </div>
                        </div>
                        <div className={modalClasses.footer}>
                            <Button variant="dark" onClick={() => setModal(0)}>
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
                        <div className={modalClasses.content}>
                            <h2 className="text-center">Join a Server</h2>
                            <p className="text-center">Enter an invite to join a server</p>
                            <Stack size={3}>
                                <div className="Input-Form">
                                    <TextInput.Label>Server Invite</TextInput.Label>
                                    <TextInput
                                        type="text"
                                        value={invite}
                                        onChange={(e) =>
                                            setInvite((e.target as HTMLInputElement).value)
                                        }
                                        fill
                                        placeholder={"https://wyvern.tkdkid1000.net/invite/abcdef"}
                                    />
                                </div>
                            </Stack>
                        </div>
                        <div className={modalClasses.footer}>
                            <Button variant="dark" onClick={() => setModal(0)}>
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
                        <div className={modalClasses.content}>
                            <h2 className="text-center">Invite People</h2>
                            <div>
                                <Stack size={3}>
                                    <div className="Input-Form">
                                        <TextInput type="text" defaultValue={invite} readOnly />
                                    </div>
                                    <Button variant="primary">Copy</Button>
                                </Stack>
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
