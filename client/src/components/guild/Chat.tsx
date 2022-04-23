import axios from "axios"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { FaSmileWink } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useGlobalState } from "../../App"
import { Message, TextChannel } from "../../globals"
import { useForceUpdate } from "../../utils"
import { useAlert } from "../Alerts"
import { SocketIO, useSocket } from "../SocketIO"
import { EmojiPopup } from "../ui/EmojiPopup"
import { ChatMessage } from "./Message"

export function Chat(props: { guildId: string; channelId: string }) {
    const [user] = useGlobalState("user")
    const [messages, setMessages] = useState<Message[]>([])
    const [currentMessage, setCurrentMessage] = useState("")
    const [channel, setChannel] = useState<TextChannel>(undefined)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)
    const [inputHeight, setInputHeight] = useState(0)
    const socket = useSocket()
    const forceUpdate = useForceUpdate()
    const navigate = useNavigate()
    const alert = useAlert()

    const newChatMessage = useCallback((message: Message) => {
        const messageScroll =
            messagesRef.current.scrollTop + 100 >
            messagesRef.current.scrollHeight - messagesRef.current.clientHeight
        messages.push(message)
        setMessages(messages)
        setTimeout(() => {
            forceUpdate()
            if (messagesRef) {
                setTimeout(() => {
                    if (messageScroll) {
                        messagesRef.current.scroll({
                            top: messagesRef.current.scrollHeight,
                            behavior: "auto"
                        })
                    }
                }, 0)
            }
        }, 100)
    }, [])

    const initalChatMessages = useCallback(
        (inital: { messages: Message[]; channel: string }) => {
            inital.messages.forEach((message) => messages.push(message))
            setMessages(messages)
            forceUpdate()
            setTimeout(() => {
                messagesRef.current.scroll({
                    top: messagesRef.current.scrollHeight,
                    behavior: "auto"
                })
            }, 10)
        },
        [props.channelId]
    )

    //

    useEffect(() => {
        if (!props.channelId) {
            socket.on("kick from chat", () => {
                alert({
                    text: "You aren't a member of this server!",
                    type: "warning"
                })
                navigate("/channels/@me")
            })
        }
        if (user && props.channelId) {
            axios
                .get(`/api/channels/${props.guildId}/${props.channelId}`, {
                    headers: {
                        authorization: sessionStorage.getItem("token")
                    }
                })
                .then((response) => {
                    setChannel(response.data.channel)
                })
            // socket.on("initial chat messages", initalChatMessages)
            socket.emit("join chat channel", {
                channel: props.channelId,
                guild: props.guildId,
                user: user?.id
            })
        }
        return () => {
            messages.length = 0
            setMessages(messages)
            // socket.off("initial chat messages", initalChatMessages)
            socket.emit("leave chat channel", {
                channel: props.channelId
            })
        }
    }, [user, props.channelId])

    const keyListener = (event: KeyboardEvent) => {
        if (
            [
                event.ctrlKey,
                event.metaKey,
                event.altKey,
                event.key === "Tab",
                event.key === "Backspace",
                event.key === "CapsLock",
                event.key === "Enter",
                event.key === "Escape",
                event.key.startsWith("Arrow")
            ].every((v) => v !== true)
        ) {
            if (document.activeElement === document.body) {
                if (!event.shiftKey) {
                    const [start, end] = [
                        messageInputRef.current.selectionStart,
                        messageInputRef.current.selectionEnd
                    ]
                    messageInputRef.current.setRangeText(event.key, start, end, "select")
                }
                messageInputRef.current.focus()
            }
        }
    }

    const pasteListener = (event: ClipboardEvent) => {
        // console.log(document.activeElement)
        // if (document.activeElement.tagName !== "body") return
        // const paste = event.clipboardData.getData("text")
        // const [start, end] = [
        //     messageInputRef.current.selectionStart,
        //     messageInputRef.current.selectionEnd
        // ]
        // messageInputRef.current.setRangeText(paste, start, end, "select")
        // messageInputRef.current.focus()
    }

    useEffect(() => {
        document.addEventListener("keydown", keyListener)
        document.addEventListener("paste", pasteListener)
        return () => {
            document.removeEventListener("keydown", keyListener)
            document.removeEventListener("paste", pasteListener)
        }
    }, [])

    useEffect(() => {
        if (currentMessage.split("\n").length - 1 < 10) {
            const messageScroll =
                messagesRef.current.scrollTop + 100 >
                messagesRef.current.scrollHeight - messagesRef.current.clientHeight
            setInputHeight(currentMessage.split("\n").length - 1)
            if (messageScroll) {
                messagesRef.current.scrollTop =
                    messagesRef.current.scrollHeight - messagesRef.current.clientHeight
            }
        }
    }, [currentMessage])

    return (
        <div className="Chat" key={props.guildId}>
            <SocketIO.Listener event="chat message" on={newChatMessage} />
            <SocketIO.Listener event="initial chat messages" on={initalChatMessages} />
            <div ref={messagesRef} className="Messages">
                <div className="beginning">
                    <div className="content">
                        <h3>Welcome to #{channel?.name}</h3>
                        <span>This begins the conversation in the #{channel?.name} channel</span>
                        <hr />
                    </div>
                </div>
                {messages.map((message: Message, index: number) => (
                    <ChatMessage
                        key={index}
                        message={message}
                        prevAuthor={messages[index - 1]?.author}
                    />
                ))}
            </div>
            <div
                className="MessageInput"
                style={{
                    height: 70 + 35 * inputHeight + "px"
                }}
            >
                <div className="Input">
                    <textarea
                        placeholder={`Message #${channel?.name}`}
                        ref={messageInputRef}
                        value={currentMessage}
                        onChange={(event) => setCurrentMessage(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault()
                                if (
                                    currentMessage.trim().length > 0 &&
                                    currentMessage.trim().length < 2000
                                ) {
                                    socket.emit("chat message", {
                                        author: user.id,
                                        message: currentMessage,
                                        channel: props.channelId,
                                        guild: props.guildId
                                    })
                                    setCurrentMessage("")
                                    messagesRef.current.scrollTop =
                                        messagesRef.current.scrollHeight -
                                        messagesRef.current.clientHeight
                                }
                            }
                        }}
                    />
                    <div className="buttons">
                        <EmojiPopup onSelect={() => {}}>
                            <button>
                                <FaSmileWink size={25} />
                            </button>
                        </EmojiPopup>
                        <div
                            className="length-indicator"
                            style={{
                                color: currentMessage.length > 2000 ? "red" : "white"
                            }}
                        >
                            {currentMessage.length >= 1800 ? 2000 - currentMessage.length : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
