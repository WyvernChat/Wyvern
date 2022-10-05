import React, { useEffect } from "react"
import { createGlobalState } from "react-hooks-global-state"
import { Socket } from "socket.io-client"
import { AlertProvider } from "./components/Alerts"
import { AuthProvider } from "./components/Auth"
import { Router } from "./components/Router"
import { SocketIO } from "./components/SocketIO"
import { ContentMenuProvider } from "./components/ui/ContextMenu"
import { Guild, User } from "./globals"
import { useGuilds } from "./hooks/guild"
import { getUser } from "./hooks/user"

interface GlobalState {
    token: string
    user: User
    users: User[]
    guilds: Guild[]
}

const initialGlobalState: GlobalState = {
    token: localStorage.getItem("token") || "",
    user: undefined,
    users: [],
    guilds: []
}

const { useGlobalState } = createGlobalState(initialGlobalState)

export function App(props: { socket: Socket }) {
    const [token] = useGlobalState("token")
    const [user, setUser] = useGlobalState("user")
    useGuilds(token)

    useEffect(() => {
        getUser(token).then(setUser)
        localStorage.setItem("token", token)
    }, [token])

    useEffect(() => {
        if (user) {
            props.socket.emit("IDENTIFY", {
                token
            })
        }
    }, [user])

    return (
        <AuthProvider>
            <SocketIO socket={props.socket}>
                <AlertProvider>
                    <ContentMenuProvider>
                        <Router />
                    </ContentMenuProvider>
                </AlertProvider>
            </SocketIO>
        </AuthProvider>
    )
}

export { useGlobalState }
