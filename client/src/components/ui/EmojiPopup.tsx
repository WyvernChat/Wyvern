import React, { ReactNode, useEffect, useRef, useState } from "react"
import { Overlay, OverlayTrigger, Popover, Tooltip } from "react-bootstrap"
import { FaDog, FaFlag, FaGamepad, FaGem, FaPlane, FaSmileWink, FaStop } from "react-icons/fa"
import emojis from "./emojis.json"

interface Emoji {
    no: number
    code: string
    flagged: boolean
    keywords: string[]
}

const useEmojis = () => {
    const emojiList = useRef<Record<string, Emoji[]>>({})
    useEffect(() => {
        emojiList.current = emojis
    }, [])
    return emojiList
}

const filterEmojis = (text: string) => {
    const baseEmojis = [].concat.apply(
        [],
        Object.keys(emojis).map((category) => emojis[category])
    ) as Emoji[]

    // text.match()

    // baseEmojis.forEach((emoji) =>
    //     emoji.keywords.forEach((keyword) => {
    //         // console.log(new RegExp(`/:${keyword}:/`).test(text))
    //         // text.replace(new RegExp(`/:${keyword}:/`), emoji.code)
    //     })
    // )
    return text
}

function EmojiPopup(props: { children: ReactNode; onSelect: (emoji: Emoji) => void }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const buttonRef = useRef<HTMLElement>(null)
    const menuRef = useRef<HTMLElement>(null)
    const emojis = useEmojis()

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
        return () => {
            document.removeEventListener("mousedown", closeMenu)
            document.removeEventListener("keydown", closeMenuKey)
        }
    }, [])

    useEffect(() => {
        return () => {
            setOpen(false)
            document.removeEventListener("mousedown", closeMenu)
            document.removeEventListener("keydown", closeMenuKey)
        }
    }, [])

    useEffect(() => {
        if (!open) setSearch("")
    }, [open])

    const categoryIcons = [
        <FaSmileWink size={25} />,
        <FaDog size={25} />,
        <FaPlane size={25} />,
        <FaGamepad size={25} />,
        <FaGem size={25} />,
        <FaStop size={25} />,
        <FaFlag size={25} />
    ]

    return (
        <>
            <Overlay placement="top-end" ref={menuRef} target={buttonRef} show={open}>
                <div className="EmojiPopup">
                    <div className="GroupList">
                        {Object.keys(emojis.current).map((category, index) => (
                            <OverlayTrigger
                                placement="left"
                                overlay={<Tooltip>{category}</Tooltip>}
                                key={index}
                            >
                                <div className="Group">{categoryIcons[index]}</div>
                            </OverlayTrigger>
                        ))}
                    </div>
                    <div className="EmojiContainer">
                        <div className="Search">
                            <input
                                placeholder="Search for emojis"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </div>
                        <div className="EmojiList">
                            {Object.keys(emojis.current).map((categoryName, index) => {
                                const category = emojis.current[categoryName]
                                return (
                                    <div className="Section" key={index}>
                                        <span className="title">
                                            {categoryName} - {category.length}
                                        </span>
                                        <div className="Emojis">
                                            {category.map((emoji, i) => {
                                                return search.length < 1 ? (
                                                    <div
                                                        className="Emoji"
                                                        key={i}
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                emoji.code
                                                                    .split(" ")[0]
                                                                    .replace("U+", "&#x") + ";"
                                                        }}
                                                        onClick={() => props.onSelect(emoji)}
                                                    ></div>
                                                ) : (
                                                    emoji.keywords.some((kw) =>
                                                        kw.includes(search)
                                                    ) && (
                                                        <OverlayTrigger
                                                            key={emoji.no}
                                                            placement="right"
                                                            overlay={() => (
                                                                <Popover>
                                                                    <b>{emoji.no}</b>
                                                                </Popover>
                                                            )}
                                                        >
                                                            <div
                                                                className="Emoji"
                                                                key={i}
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        emoji.code
                                                                            .split(" ")[0]
                                                                            .replace("U+", "&#x") +
                                                                        ";"
                                                                }}
                                                                onClick={() =>
                                                                    props.onSelect(emoji)
                                                                }
                                                            ></div>
                                                        </OverlayTrigger>
                                                    )
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
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

export { Emoji, useEmojis, filterEmojis, EmojiPopup }
