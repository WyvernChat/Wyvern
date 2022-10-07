import React, { createContext, ReactNode, useContext, useEffect } from "react"
import { Socket } from "socket.io-client"

const SocketIOContext = createContext<Socket>(undefined)

function SocketIO(props: { socket: Socket; children: ReactNode }) {
    useEffect(() => {
        props.socket.onAny((event, data) => {
            console.log(`Event ${event} called with`, data)
        })
    }, [props.socket])
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
    }, [eventName, handler, socket])
}

export { SocketIO, useSocket, useSocketListener }
