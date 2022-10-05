import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    FaAngry,
    FaGrin,
    FaGrinHearts,
    FaHashtag,
    FaSadCry,
    FaSmile,
    FaSmileWink
} from "react-icons/fa"
import InfiniteScroller from "react-infinite-scroller"
import { useNavigate } from "react-router-dom"
import { useGlobalState } from "../../App"
import { Message } from "../../globals"
import { useChannel } from "../../hooks/channel"
import { useAlert } from "../Alerts"
import { useSocket, useSocketListener } from "../SocketIO"
import { EmojiPopup } from "../ui/EmojiPopup"
import { ChatMessage } from "./Message"

export function Chat(props: { guildId: string; channelId: string }) {
    const [token] = useGlobalState("token")
    const [user] = useGlobalState("user")
    const [messages, setMessages] = useState<Message[]>([])
    const [currentMessage, setCurrentMessage] = useState("")
    const [channel] = useChannel(props.channelId, props.guildId)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)
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

    const initialChatMessages = useCallback((initial: { messages: Message[]; channel: string }) => {
        setMessages(() => [...initial.messages])
        setTimeout(() => {
            messagesRef.current.scroll({
                top: messagesRef.current.scrollHeight,
                behavior: "auto"
            })
        }, 10)
    }, [])

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
    }, [user, props.channelId, token, props.guildId, socket, alert, navigate])

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

    const pasteListener = () => {
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

    // useEffect(() => {
    //     if (messages) {
    //         // setLoadScroll(0)
    //         messagesRef.current.scroll({
    //             top: loadScroll
    //         })
    //     }
    // }, [loadScroll, messages])
    useSocketListener("chat message", newChatMessage)
    useSocketListener("initial chat messages", initialChatMessages)
    useSocketListener<{ messages: Message[] }>("retrieve channel messages", (data) => {
        messagesLoading.current = false
        setMessages([...data.messages, ...messages])
    })

    return (
        <div className="Chat" key={props.guildId}>
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
                    loader={<div>Loading</div>}
                    hasMore={true || false}
                    useWindow={false}
                    isReverse
                    initialLoad={false}
                >
                    {messages.map((message: Message, index: number) => (
                        <ChatMessage
                            key={message.id}
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
            <div className="MessageInput">
                <div className="Input">
                    <textarea
                        placeholder={`Message #${channel?.name}`}
                        ref={messageInputRef}
                        value={currentMessage}
                        style={{
                            height: "2ch",
                            overflowY:
                                messageInputRef.current?.scrollHeight > 255 ? "scroll" : "hidden"
                        }}
                        onChange={(event) => {
                            setCurrentMessage(event.target.value)
                            messageInputRef.current.style.height = "0px"
                            const { scrollHeight } = messageInputRef.current
                            messageInputRef.current.style.height = `${
                                scrollHeight > 255 ? 255 : scrollHeight
                            }px`
                        }}
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
                                    messageInputRef.current.style.height = "2ch"
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
                            <EmojiCarousel />
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

const EmojiCarousel = () => {
    const emojis = useRef([
        <FaSmile key="FaSmile" size={25} />,
        <FaSmileWink key="FaSmileWink" size={25} />,
        <FaGrin key="FaGrin" size={25} />,
        <FaSadCry key="FaSadCry" size={25} />,
        <FaAngry key="FaAngry" size={25} />,
        <FaGrinHearts key="FaGrinHearts" size={25} />
    ])
    const [emoji, setEmoji] = useState(0)

    return (
        <button
            className="emoji-button"
            onMouseEnter={() => setEmoji(Math.floor(Math.random() * emojis.current.length))}
        >
            {emojis.current[emoji]}
        </button>
    )
}
