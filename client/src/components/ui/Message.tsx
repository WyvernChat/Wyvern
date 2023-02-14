import axios from "axios"
import dayjs from "dayjs"
import React, { memo, useCallback, useEffect, useState } from "react"
import { useGlobalState } from "../../App"
import { Message } from "../../globals"
import { useCachedUser } from "../../hooks/user"
import logoUrl from "../../img/logos/WyvernLogoGrayscale-512x512.png"
import classes from "../../scss/ui/message.module.scss"
import Markdown, { useMarkdown } from "./Markdown"
import UserMenu from "./UserMenu"

export const ChatMessage = memo(function ChatMessage(props: {
    message: Message
    showAvatar: boolean
}) {
    const [user] = useGlobalState("user")
    // const [userCache, setUserCache] = useGlobalState("userCache")
    const author = useCachedUser(props.message.author)
    const [embeds, setEmbeds] = useState<string[]>([])
    const markdown = useMarkdown(props.message.content || "")

    const embedCallback = useCallback((element: HTMLDivElement) => {
        setEmbeds((embeds) => {
            element.querySelectorAll("a").forEach((item) => {
                if (embeds.indexOf(item.href) === -1) {
                    embeds.push(item.href)
                }
            })
            return embeds
        })
    }, [])

    return (
        <div className={classes.message}>
            {props.showAvatar ? (
                <>
                    <UserMenu userId={author?.id} placement="right" offset={[0, 0]}>
                        <img src={logoUrl} className={classes.avatar} />
                    </UserMenu>
                    <div>
                        <UserMenu userId={author?.id} placement="right" offset={[8, 0]}>
                            <span
                                style={{
                                    color: author?.id === user.id ? "red" : ""
                                }}
                                tabIndex={0}
                                className={`${classes.user} outlined`}
                            >
                                {author?.username}
                            </span>
                        </UserMenu>
                        <span className={classes.date}>
                            {formatDate(new Date(props.message.sent))}
                        </span>
                        <div className={classes.messagewrapper}>
                            {!props.showAvatar && (
                                <div className={classes.hoverdate}>
                                    {formatTime(new Date(props.message.sent))}
                                </div>
                            )}
                            <div className={classes.contentwrapper}>
                                <div
                                    // ref={(ref) => {
                                    //     if (ref) {
                                    //         embedCallback(ref)
                                    //     }
                                    // }}
                                    className={classes.content}
                                >
                                    {/* <ReactMarkdown
                                        allowedElements={[
                                            "p",
                                            "strong",
                                            "delete",
                                            "emphasis",
                                            "link"
                                        ]}
                                        unwrapDisallowed
                                    >
                                        {props.message.content}
                                    </ReactMarkdown> */}
                                    <Markdown text={props.message.content} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className={classes.messagewrapper}>
                    {!props.showAvatar && (
                        <div className={classes.hoverdate}>
                            {formatTime(new Date(props.message.sent))}
                        </div>
                    )}
                    <div className={classes.contentwrapper}>
                        <div
                            // ref={(ref) => {
                            //     if (ref) {
                            //         embedCallback(ref)
                            //     }
                            // }}
                            className={classes.content}
                        >
                            {/* <ReactMarkdown
                                components={{
                                    img: Twemoji
                                }}
                                allowedElements={["p", "strong", "delete", "emphasis", "link"]}
                            >
                                {props.message.content}
                            </ReactMarkdown> */}
                            <Markdown text={props.message.content} />
                        </div>
                    </div>
                </div>
            )}
            {embeds.length > 0 && (
                <div className={classes.embedwrapper}>
                    {embeds.map((embed, index) => (
                        <MessageEmbed key={index} url={embed} />
                    ))}
                </div>
            )}
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
                    <a href={videoData?.author_url} target="_blank" rel="noreferrer">
                        {videoData?.author_name}
                    </a>
                </div>
                <div className="title">
                    <a href={props.url} target="_blank" rel="noreferrer">
                        {videoData?.title}
                    </a>
                </div>
                <div className="yt-video">
                    <iframe src={`https://www.youtube.com/embed/${video}`}>
                        So like the iframe didn&apos;t work
                    </iframe>
                </div>
            </div>
        )
    } else {
        return <div></div>
    }
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

function formatTime(date: Date) {
    return date.toLocaleString("en-US", { hour: "numeric", hour12: true, minute: "numeric" })
}
