import axios from "axios"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { FaHashtag, FaSmileWink } from "react-icons/fa"
import InfiniteScroller from "react-infinite-scroller"
import { useNavigate } from "react-router-dom"
import { useGlobalState } from "../../App"
import { Message, TextChannel } from "../../globals"
import { useAlert } from "../Alerts"
import { SocketIO, useSocket } from "../SocketIO"
import { EmojiPopup } from "../ui/EmojiPopup"
import { ChatMessage } from "./Message"

export function Chat(props: { guildId: string; channelId: string }) {
    const [token] = useGlobalState("token")
    const [user] = useGlobalState("user")
    const [messages, setMessages] = useState<Message[]>([])
    const [currentMessage, setCurrentMessage] = useState("")
    const [channel, setChannel] = useState<TextChannel>(undefined)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)
    const [inputHeight, setInputHeight] = useState(0)
    const messagesLoading = useRef(false)
    const socket = useSocket()
    const navigate = useNavigate()
    const alert = useAlert()

    const newChatMessage = useCallback((message: Message) => {
        const messageScroll =
            messagesRef.current.scrollTop + 100 >
            messagesRef.current.scrollHeight - messagesRef.current.clientHeight
        setMessages((prevMessages) => [...prevMessages, message])
        if (messagesRef) {
            if (messageScroll) {
                setTimeout(() => {
                    messagesRef.current.scroll({
                        top: messagesRef.current.scrollHeight,
                        behavior: "auto"
                    })
                }, 10)
            }
        }
    }, [])

    const initalChatMessages = useCallback(
        (inital: { messages: Message[]; channel: string }) => {
            setMessages(() => [...inital.messages])
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
                        authorization: token
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
            setMessages([])
            // socket.off("initial chat messages", initalChatMessages)
            socket.emit("leave chat channel", {
                channel: props.channelId
            })
        }
    }, [user, props.channelId, token])

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
                    setCurrentMessage(messageInputRef.current.value)
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

    // useEffect(() => {
    //     if (messages) {
    //         // setLoadScroll(0)
    //         messagesRef.current.scroll({
    //             top: loadScroll
    //         })
    //     }
    // }, [loadScroll, messages])

    return (
        <div className="Chat" key={props.guildId}>
            <SocketIO.Listener event="chat message" on={newChatMessage} />
            <SocketIO.Listener event="initial chat messages" on={initalChatMessages} />
            <SocketIO.Listener
                event="retrieve channel messages"
                on={(data) => {
                    messagesLoading.current = false
                    setMessages([...data.messages, ...messages])
                }}
            />
            <div className="ChannelHeader">
                <span className="text">
                    <FaHashtag /> {channel?.name}
                </span>
                <div className="separator"></div>
                <span className="description">{channel?.description}</span>
            </div>
            <div ref={messagesRef} className="Messages">
                <div className="beginning">
                    <div className="content">
                        <h3>Welcome to #{channel?.name}</h3>
                        <span>This begins the conversation in the #{channel?.name} channel</span>
                        <hr />
                    </div>
                </div>
                <InfiniteScroller
                    pageStart={0}
                    loadMore={() => {
                        if (channel && messages && messages[0] && !messagesLoading.current) {
                            messagesLoading.current = true
                            socket.emit("retrieve channel messages", {
                                channel: channel.id,
                                guild: props.guildId,
                                previous: messages[0].id
                            })
                        }
                    }}
                    hasMore={true || false}
                    loader={<div key={0}>Loading</div>}
                    useWindow={false}
                    isReverse={true}
                >
                    {messages.map((message: Message, index: number) => (
                        <ChatMessage
                            key={index}
                            message={message}
                            showAvatar={
                                messages[index - 1]
                                    ? message.author !== messages[index - 1]?.author
                                    : true
                            }
                        />
                    ))}
                </InfiniteScroller>
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
                        <EmojiPopup
                            onSelect={(emoji) => {
                                const [start, end] = [
                                    messageInputRef.current.selectionStart,
                                    messageInputRef.current.selectionEnd
                                ]
                                messageInputRef.current.setRangeText(
                                    `:${emoji.keywords[0]}:`,
                                    start,
                                    end,
                                    "end"
                                )
                                setCurrentMessage(messageInputRef.current.value)
                            }}
                        >
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
