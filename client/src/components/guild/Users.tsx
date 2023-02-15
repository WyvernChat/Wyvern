import React, { useEffect, useState } from "react"
import { useGlobalState } from "../../App"
import { User } from "../../globals"
import { getCachedUser } from "../../hooks/user"
import logoUrl from "../../img/logos/WyvernLogoGrayscale-512x512.png"
import { useSocket, useSocketListener } from "../SocketIO"
import UserMenu from "../ui/UserMenu"

type UsersProps = {
    guildId: string
    hide?: boolean
}

const Users = ({ guildId, hide }: UsersProps) => {
    const [users, setUsers] = useState<{ user: string; online: boolean }[]>([])
    const socket = useSocket()

    // useEffect(() => {
    //     setInterval(() => {
    //         socket.emit("fetch guild users", {
    //             guildId: props.guildId
    //         })
    //     }, 60000)
    // }, [socket, props.guildId])

    // useEffect(() => {
    //     socket.emit("fetch guild users", {
    //         guildId: props.guildId
    //     })
    // }, [socket, props.guildId])

    useSocketListener<{ members: [{ user: string; online: boolean }] }>(
        "send guild users",
        ({ members }) => setUsers(members)
    )

    const onlineUsers = users.filter((u) => u.online)
    const offlineUsers = users.filter((u) => !u.online)

    return (
        <div className="UserBar" style={{ display: hide && "none" }}>
            <div className="TopBar"></div>
            <div className="Users">
                <div className="Title">Online - {onlineUsers.length}</div>
                <div>
                    {onlineUsers.map((u, index) => (
                        <ActiveUser key={index} userId={u.user} online />
                    ))}
                </div>
                <div className="Title">Offline - {offlineUsers.length}</div>
                <div>
                    {offlineUsers.map((u, index) => (
                        <ActiveUser key={index} userId={u.user} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function ActiveUser(props: { userId: string; online?: boolean }) {
    const [users, setUsers] = useGlobalState("users")
    const [user, setUser] = useState<User>(undefined)

    useEffect(() => {
        if (props.userId) {
            getCachedUser(props.userId, users).then(({ cachedUser, newCache }) => {
                setUsers(newCache)
                setUser(cachedUser)
            })
        }
    }, [props.userId])

    return (
        <UserMenu userId={props.userId} placement="left">
            <div className={`user ${props.online ? "" : "offline"}`}>
                <img src={logoUrl} className="avatar" />
                <span className="username">{user?.username}</span>
            </div>
        </UserMenu>
    )
}

export default Users
