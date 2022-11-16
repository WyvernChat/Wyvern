import React, { useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { createGlobalState } from "react-hooks-global-state"
import { Socket } from "socket.io-client"
import { AlertProvider } from "./components/Alerts"
import { AuthProvider } from "./components/auth/Auth"
import { Router } from "./components/Router"
import { SocketIO } from "./components/SocketIO"
import { ContentMenuProvider } from "./components/ui/ContextMenu"
import { Channel, Guild, User } from "./globals"
import { useOffline } from "./hooks/offline"
import { getUser } from "./hooks/user"

interface GlobalState {
    token: string
    user: User
    users: User[]
    guilds: Guild[]
    channels: Channel[]
}

const initialGlobalState: GlobalState = {
    token: localStorage.getItem("token") || "",
    user: undefined,
    users: [],
    guilds: [],
    channels: []
}

const { useGlobalState } = createGlobalState(initialGlobalState)

export function App(props: { socket: Socket }) {
    const [token] = useGlobalState("token")
    const [user, setUser] = useGlobalState("user")
    const offline = useOffline()

    useEffect(() => {
        if (offline) return
        getUser(token).then(setUser)
        localStorage.setItem("token", token)
    }, [setUser, token, offline])

    useEffect(() => {
        if (!user || offline) return
        props.socket.emit("IDENTIFY", {
            token
        })
    }, [props.socket, token, user, offline])

    if (offline) return <div>Offline</div>

    return (
        <AuthProvider>
            <SocketIO socket={props.socket}>
                <AlertProvider>
                    <ContentMenuProvider>
                        <DndProvider backend={HTML5Backend}>
                            <Router />
                        </DndProvider>
                    </ContentMenuProvider>
                </AlertProvider>
            </SocketIO>
        </AuthProvider>
    )
}

export { useGlobalState }
