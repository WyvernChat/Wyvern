import React, { createContext, ReactNode, useContext, useEffect } from "react"
import { Socket } from "socket.io-client"

const SocketIOContext = createContext<Socket>(undefined)

function SocketIO(props: { socket: Socket; children: ReactNode }) {
    return (
        <SocketIOContext.Provider value={props.socket}>{props.children}</SocketIOContext.Provider>
    )
}

SocketIO.Listener = (props: { event: string; on: (...args: any[]) => void }) => {
    const socket = useSocket()
    const event = (data: any) => {
        props.on(data)
    }
    useEffect(() => {
        // console.log("listener added for " + props.event)
        socket.on(props.event, event)
        return () => {
            // console.log("listener removed for " + props.event)
            socket.off(props.event, event)
        }
    }, [])
    return <></>
}

const useSocket = () => useContext(SocketIOContext)

export { SocketIO, useSocket }
