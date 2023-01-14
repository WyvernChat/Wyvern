/// <reference lib="dom" />

import axios from "axios"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { FaBars, FaHashtag } from "react-icons/fa"
import { useGlobalState } from "../../App"
import { Message } from "../../globals"
import { useChannel } from "../../hooks/channel"
import { useMessages } from "../../hooks/message"
import classes from "../../scss/chat.module.scss"
import { useDisableScroll, useTitle } from "../../utils"
import { useSocket } from "../SocketIO"
import { ChatMessage } from "../ui/Message"
import MessageInput from "../ui/MessageInput"
import { MobileView } from "./Guild"

type ChatProps = {
    channelId: string
    hide?: boolean
    setView?: (view: MobileView) => void
}

const Chat = ({ channelId, hide, setView }: ChatProps) => {
    const [token] = useGlobalState("token")
    const [channel] = useChannel(channelId)
    const [messages, setMessages] = useMessages(channelId, {})
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [finishedLoading, setFinishedLoading] = useState(false)

    const messagesRef = useRef<HTMLDivElement>(null)
    const socket = useSocket()

    useDisableScroll(messagesRef, loadingMessages && !finishedLoading)

    useTitle(`Wyvern | ${channel?.name || ""}`)

    useEffect(() => {
        if (messagesRef.current && messages.length <= 50) {
            setTimeout(() => {
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight
                setLoadingMessages(false)
            }, 1)
        }
    }, [messagesRef, channelId, messages])

    useLayoutEffect(() => {
        if (!messagesRef) return
        const messageScroll =
            messagesRef.current.scrollTop + 200 >
            messagesRef.current.scrollHeight - messagesRef.current.offsetHeight
        if (messageScroll) {
            setTimeout(() => {
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight
            }, 1)
        }
    }, [messages])

    return (
        <div className={`${classes.chat} ${hide ? "none" : ""}`}>
            <div className={classes.header}>
                <span className={classes.text} onClick={() => setView("channels")}>
                    <FaBars
                        className="md-none"
                        style={{
                            color: "white",
                            padding: "0 10px"
                        }}
                    />
                </span>
                <span className={classes.text}>
                    <FaHashtag /> {channel?.name}
                </span>
                <div className={classes.separator}></div>
                <span className={classes.description}>{channel?.description}</span>
            </div>
            <div
                ref={messagesRef}
                className={classes.messages}
                onScroll={() => {
                    if (
                        !loadingMessages &&
                        !finishedLoading &&
                        messagesRef.current.scrollTop < 1000
                    ) {
                        setLoadingMessages(true)
                        axios
                            .get(`/api/channels/${channelId}/messages`, {
                                params: {
                                    before: messages[0].id
                                },
                                headers: {
                                    authorization: token
                                }
                            })
                            .then((res) => res.data)
                            .then((msgs) => {
                                if (msgs.length > 0) {
                                    setTimeout(() => {
                                        setLoadingMessages(false)
                                        setMessages((prevMessages) => [...msgs, ...prevMessages])
                                    }, 2000)
                                } else {
                                    setFinishedLoading(true)
                                }
                            })
                    }
                }}
            >
                <div className={classes.beginning}>
                    <div className={classes.content}>
                        <h3>Welcome to #{channel?.name}</h3>
                        <span>This begins the conversation in the #{channel?.name} channel</span>
                        <hr />
                    </div>
                </div>
                {messages.map((message: Message, index: number) => (
                    // todo: add separator between different message days
                    <ChatMessage
                        key={message.id}
                        message={message}
                        showAvatar={
                            messages[index - 1]
                                ? message.author !== messages[index - 1]?.author ||
                                  message.sent - messages[index - 1]?.sent > 60 * 60 * 1000
                                : true
                        }
                    />
                ))}
            </div>
            <MessageInput
                placeholder={`Message #${channel?.name}`}
                onSubmit={(content) => {
                    socket.emit("MESSAGE_CREATE", {
                        content,
                        channelId
                    })
                }}
            />
        </div>
    )
}

export default Chat
