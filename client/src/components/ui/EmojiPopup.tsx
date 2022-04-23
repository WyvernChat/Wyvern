import React, { ReactNode, useEffect, useRef, useState } from "react"
import { Overlay, Popover } from "react-bootstrap"
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

function EmojiPopup(props: { children: ReactNode; onSelect: (emoji: Emoji) => void }) {
    const [open, setOpen] = useState(false)
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

    return (
        <>
            <Overlay placement="top-end" ref={menuRef} target={buttonRef} show={open}>
                <Popover className="UserMenu">
                    <Popover.Header as="h3">Emojis</Popover.Header>
                    <Popover.Body>
                        <div className="EmojiPopup">
                            {Object.keys(emojis.current).map((categoryName, index) => {
                                const category = emojis.current[categoryName]
                                return (
                                    <div className="Section" key={index}>
                                        <span className="title">
                                            {categoryName} - {category.length}
                                        </span>
                                        <div className="Emojis">
                                            {category.map((emoji, i) => {
                                                return (
                                                    <div
                                                        className="Emoji"
                                                        key={i}
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                emoji.code
                                                                    .split(" ")[0]
                                                                    .replace("U+", "&#x") + ";"
                                                        }}
                                                    ></div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
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

export { Emoji, useEmojis, EmojiPopup }
