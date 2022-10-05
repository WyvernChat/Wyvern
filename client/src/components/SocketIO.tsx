import React, { createContext, ReactNode, useContext, useEffect } from "react"
import { Socket } from "socket.io-client"

const SocketIOContext = createContext<Socket>(undefined)

function SocketIO(props: { socket: Socket; children: ReactNode }) {
    return (
        <SocketIOContext.Provider value={props.socket}>{props.children}</SocketIOContext.Provider>
    )
}

const useSocket = () => useContext(SocketIOContext)
const useSocketListener = <Args,>(eventName: string, handler: (...args: Args[]) => void) => {
    const socket = useSocket()
    useEffect(() => {
        socket.on(eventName, handler)
        return () => {
            socket.off(eventName, handler)
        }
    }, [])
}

export { SocketIO, useSocket, useSocketListener }
