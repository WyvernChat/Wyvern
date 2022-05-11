import React, { useCallback, useEffect } from "react"
import { createGlobalState } from "react-hooks-global-state"
import { Socket } from "socket.io-client"
import { AlertProvider } from "./components/Alerts"
import { AuthProvider } from "./components/Auth"
import { Router } from "./components/Router"
import { SocketIO } from "./components/SocketIO"
import { ContentMenuProvider } from "./components/ui/ContextMenu"
import { User } from "./globals"
import { getUserData } from "./usermanagement"

interface GlobalState {
    token: string
    user: User
    userCache: User[]
}

const initialGlobalState: GlobalState = {
    token: localStorage.getItem("token") || "",
    user: undefined,
    userCache: []
}

const { useGlobalState } = createGlobalState(initialGlobalState)

export function App(props: { socket: Socket }) {
    const [token] = useGlobalState("token")
    const [, setUser] = useGlobalState("user")

    const updateUser = useCallback(async () => {
        setUser(await getUserData(token))
    }, [token])

    useEffect(() => {
        updateUser()
    }, [])

    useEffect(() => {
        localStorage.setItem("token", token)
        updateUser()
    }, [token])

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
