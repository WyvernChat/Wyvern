import axios from "axios"
import dayjs from "dayjs"
import React, { memo, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { Dropdown, FormControl, Overlay, Popover } from "react-bootstrap"
import { useGlobalState } from "../../App"
import { Message, User } from "../../globals"
import { getCachedUser } from "../../usermanagement"
import { ContextMenu, ContextMenuButton } from "../ui/ContextMenu"
import { useMarkdown } from "../ui/Markdown"

export const ChatMessage = memo(function ChatMessage(props: {
    message: Message
    prevAuthor: string
}) {
    const [user] = useGlobalState("user")
    const [userCache, setUserCache] = useGlobalState("userCache")
    const [author, setAuthor] = useState<User>(undefined)
    const [prevAuthor, setPrevAuthor] = useState<User>(undefined)
    const [embeds, setEmbeds] = useState<string[]>([])
    const markdown = useMarkdown(props.message.content)

    useEffect(() => {
        getCachedUser(props.message.author, userCache).then(({ cachedUser, newCache }) => {
            setUserCache(newCache)
            setAuthor(cachedUser)
        })
        if (props.prevAuthor) {
            getCachedUser(props.prevAuthor, userCache).then(({ cachedUser, newCache }) => {
                setUserCache(newCache)
                setPrevAuthor(cachedUser)
            })
        }
    }, [])

    const embedCallback = useCallback(
        (element: HTMLDivElement) => {
            setEmbeds((embeds) => {
                element.querySelectorAll("a").forEach((item) => {
                    if (embeds.indexOf(item.href) === -1) {
                        embeds.push(item.href)
                    }
                })
                return embeds
            })
        },
        [props.message]
    )

    return (
        <div className="message">
            {author?.id !== prevAuthor?.id && (
                <span>
                    <UserMenu userId={author?.id}>
                        <img src="/img/logos/WyvernLogoGrayscale-512x512.png" className="avatar" />
                        <strong
                            style={{
                                color: author?.id === user.id ? "red" : ""
                            }}
                            tabIndex={0}
                            className="user"
                        >
                            {author?.username}
                        </strong>
                    </UserMenu>
                    &nbsp;
                    <span className="date">{formatDate(new Date(props.message.sent))}</span>
                </span>
            )}
            <ContextMenu
                buttons={
                    <ContextMenuButton
                        onClick={() => {
                            navigator.clipboard.writeText(props.message.content)
                        }}
                    >
                        Copy Text
                    </ContextMenuButton>
                }
            >
                <div className="messagewrapper">
                    <div className="hoverdate">
                        {author?.id === prevAuthor?.id
                            ? formateTime(new Date(props.message.sent))
                            : ""}
                    </div>
                    <div className="contentwrapper">
                        <div
                            ref={(ref) => {
                                if (ref) {
                                    embedCallback(ref)
                                }
                            }}
                            className="content"
                            dangerouslySetInnerHTML={{
                                __html: markdown
                            }}
                        />
                    </div>
                </div>
            </ContextMenu>
            <div className="embedwrapper">
                {embeds.map((embed, index) => (
                    <MessageEmbed key={index} url={embed} />
                ))}
            </div>
        </div>
    )
})

function MessageEmbed(props: { url: string }) {
    const url = new URL(props.url)
    const youtubeEmbed = /^(.*?\.)?youtu(be\.com|.be)\/(?!\s*$)/gm.test(url.href)
    const [videoData, setVideoData] = useState<any>(undefined)

    useEffect(() => {
        if (youtubeEmbed) {
            const video = /youtube\.com/.test(url.hostname)
                ? url.searchParams.get("v")
                : url.pathname.replace("/", "")
            axios
                .get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${video}`)
                .then((res) => {
                    setVideoData(res.data)
                })
        }
    }, [props.url])

    if (youtubeEmbed) {
        const video = /youtube\.com/.test(url.hostname)
            ? url.searchParams.get("v")
            : url.pathname.replace("/", "")

        return (
            <div className="embed">
                <div className="author">
                    <a href={videoData?.author_url} target="_blank" rel="noopener">
                        {videoData?.author_name}
                    </a>
                </div>
                <div className="title">
                    <a href={props.url} target="_blank" rel="noopener">
                        {videoData?.title}
                    </a>
                </div>
                <div className="yt-video">
                    <iframe src={`https://www.youtube.com/embed/${video}`}>
                        So like the iframe didn't work
                    </iframe>
                </div>
            </div>
        )
    } else {
        return <div></div>
    }
}

function UserMenu(props: { userId: string; children: ReactNode }) {
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState<User>(undefined)
    const [userCache, setUserCache] = useGlobalState("userCache")

    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)
    const closeMenu = (event: MouseEvent) => {
        if (menuRef.current) {
            if (
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }
    }
    const closeMenuKey = (event: KeyboardEvent) => {
        if (event.repeat) return
        if (event.key === "Escape") {
            setOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", closeMenu)
        document.addEventListener("keydown", closeMenuKey)
        if (props.userId) {
            getCachedUser(props.userId, userCache).then(({ cachedUser, newCache }) => {
                setUserCache(newCache)
                setUser(cachedUser)
            })
        }
        return () => {
            document.removeEventListener("mousedown", closeMenu)
            document.removeEventListener("keydown", closeMenuKey)
        }
    }, [props.userId])

    useEffect(() => {
        return () => {
            setOpen(false)
            document.removeEventListener("mousedown", closeMenu)
            document.removeEventListener("keydown", closeMenuKey)
        }
    }, [])

    return (
        <>
            <Overlay placement="right" ref={menuRef} target={buttonRef} show={open}>
                <Popover className="UserMenu">
                    <Popover.Header as="h3">
                        <span className="user">
                            {user?.username}
                            <span className="tag">#{user?.tag}</span>
                        </span>
                    </Popover.Header>
                    <Popover.Body>
                        <Dropdown show>
                            <Dropdown.Header>About Me</Dropdown.Header>
                            <Dropdown.ItemText>
                                This is the demo bio. You need to add this feature.
                            </Dropdown.ItemText>
                            <Dropdown.Header>Note</Dropdown.Header>
                            <Dropdown.ItemText>
                                <FormControl placeholder="Click to add a note" />
                            </Dropdown.ItemText>
                        </Dropdown>
                    </Popover.Body>
                </Popover>
            </Overlay>
            <span
                ref={buttonRef}
                onClick={() => {
                    setOpen(true)
                }}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || "Space") {
                        setOpen(true)
                    }
                }}
            >
                {props.children}
            </span>
        </>
    )
}

function formatDate(date: Date) {
    if (dayjs(date).isYesterday())
        return (
            "Yesterday at " +
            date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true, minute: "numeric" })
        )
    if (dayjs(date).isToday())
        return (
            "Today at " +
            date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true, minute: "numeric" })
        )
    return (
        (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) +
        "/" +
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "/" +
        date.getFullYear()
    )
}

function formateTime(date: Date) {
    return date.toLocaleString("en-US", { hour: "numeric", hour12: true, minute: "numeric" })
}
