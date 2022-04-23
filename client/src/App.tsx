import React, { useCallback, useEffect } from "react"
import { createGlobalState } from "react-hooks-global-state"
import { socket } from "."
import { AlertProvider } from "./components/Alerts"
import { Router } from "./components/Router"
import { SocketIO } from "./components/SocketIO"
import { ContentMenuProvider } from "./components/ui/ContextMenu"
import { User } from "./globals"
import { getUserData } from "./usermanagement"
import { useMounted } from "./utils"

interface GlobalState {
    token: string
    user: User
    userCache: User[]
}

const initialGlobalState: GlobalState = {
    token: "",
    user: undefined,
    userCache: []
}

const { useGlobalState } = createGlobalState(initialGlobalState)

export function App() {
    const [token] = useGlobalState("token")
    const [, setUser] = useGlobalState("user")
    const isMounted = useMounted()

    const updateUser = useCallback(async () => {
        setUser(await getUserData())
    }, [token])
    useEffect(() => {
        updateUser()
    }, [])
    useEffect(() => {
        if (isMounted()) {
            localStorage.setItem("token", token)
            updateUser()
        }
    }, [token])

    return (
        <SocketIO socket={socket}>
            <AlertProvider>
                <ContentMenuProvider>
                    <Router />
                </ContentMenuProvider>
            </AlertProvider>
        </SocketIO>
    )
}

export { useGlobalState }
