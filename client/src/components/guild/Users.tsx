import React, { useEffect, useState } from "react"
import { useGlobalState } from "../../App"
import { User } from "../../globals"
import { getCachedUser } from "../../usermanagement"
import { SocketIO, useSocket } from "../SocketIO"
import { UserMenu } from "../ui/UserMenu"

export function Users(props: { guildId: string }) {
    const [users, setUsers] = useState<{ user: string; online: boolean }[]>([])
    const socket = useSocket()

    useEffect(() => {
        setInterval(() => {
            socket.emit("fetch guild users", {
                guildId: props.guildId
            })
        }, 60000)
    }, [])

    useEffect(() => {
        socket.emit("fetch guild users", {
            guildId: props.guildId
        })
    }, [props.guildId])

    return (
        <div className="UserBar">
            <SocketIO.Listener event="send guild users" on={(data) => setUsers(data.members)} />
            <div className="TopBar"></div>
            <div className="Users">
                <div className="Title">Online - {users.filter((u) => u.online).length}</div>
                <div>
                    {users
                        .filter((u) => u.online)
                        .map((u, index) => (
                            <ActiveUser key={index} userId={u.user} online />
                        ))}
                </div>
                <div className="Title">Offline - {users.filter((u) => !u.online).length}</div>
                <div>
                    {users
                        .filter((u) => !u.online)
                        .map((u, index) => (
                            <ActiveUser key={index} userId={u.user} />
                        ))}
                </div>
            </div>
        </div>
    )
}

function ActiveUser(props: { userId: string; online?: boolean }) {
    const [userCache, setUserCache] = useGlobalState("userCache")
    const [user, setUser] = useState<User>(undefined)

    useEffect(() => {
        if (props.userId) {
            getCachedUser(props.userId, userCache).then(({ cachedUser, newCache }) => {
                setUserCache(newCache)
                setUser(cachedUser)
            })
        }
    }, [props.userId])

    return (
        <UserMenu userId={props.userId} placement="left">
            <div className={`user ${props.online ? "" : "offline"}`}>
                <img src="/img/logos/WyvernLogoGrayscale-512x512.png" className="avatar" />
                <span className="username">{user?.username}</span>
            </div>
        </UserMenu>
    )
}
