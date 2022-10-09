import axios from "axios"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
    FaAngry,
    FaGrin,
    FaGrinHearts,
    FaHashtag,
    FaSadCry,
    FaSmile,
    FaSmileWink
} from "react-icons/fa"
import { useGlobalState } from "../../App"
import { Message } from "../../globals"
import { useChannel } from "../../hooks/channel"
import { useMessages } from "../../hooks/message"
import { useSocket } from "../SocketIO"
import { EmojiPopup } from "../ui/EmojiPopup"
import { ChatMessage } from "./Message"

export function Chat(props: { guildId: string; channelId: string }) {
    const [token] = useGlobalState("token")
    const [currentMessage, setCurrentMessage] = useState("")
    const [channel] = useChannel(props.channelId)
    const [messages, setMessages] = useMessages(props.channelId, {})
    const [loadingMessages, setLoadingMessages] = useState(true)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)
    const socket = useSocket()

    useEffect(() => {
        if (messagesRef.current && messages.length <= 50) {
            setTimeout(() => {
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight
                setLoadingMessages(false)
            }, 1)
        }
    }, [messagesRef, props.channelId, messages])

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
        <div className="Chat" key={props.guildId}>
            <div className="ChannelHeader">
                <span className="text">
                    <FaHashtag /> {channel?.name}
                </span>
                <div className="separator"></div>
                <span className="description">{channel?.description}</span>
            </div>
            <div
                ref={messagesRef}
                className="Messages"
                onScroll={() => {
                    if (!loadingMessages && messagesRef.current.scrollTop < 255) {
                        setLoadingMessages(true)
                        axios
                            .get(`/api/channels/${props.channelId}/messages`, {
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
                                    setLoadingMessages(false)
                                    setMessages((prevMessages) => [...msgs, ...prevMessages])
                                }
                            })
                    }
                }}
            >
                <div className="beginning">
                    <div className="content">
                        <h3>Welcome to #{channel?.name}</h3>
                        <span>This begins the conversation in the #{channel?.name} channel</span>
                        <hr />
                    </div>
                </div>
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
                {/* <InfiniteScroller
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
                    
                </InfiniteScroller> */}
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
                                    socket.emit("MESSAGE_CREATE", {
                                        content: currentMessage,
                                        channelId: props.channelId
                                    })
                                    messageInputRef.current.style.height = "2ch"
                                    setCurrentMessage("")
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
