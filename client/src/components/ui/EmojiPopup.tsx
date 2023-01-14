import { Button, Overlay } from "@restart/ui"
import emojis from "emoji.json"
import React, { ReactNode, useEffect, useRef, useState } from "react"
import { FaDog, FaFlag, FaGamepad, FaGem, FaPlane, FaSmileWink, FaStop } from "react-icons/fa"

const filterEmojis = (text: string) => {
    const baseEmojis = Object.keys(emojis).map((category) => emojis[category])

    // text.match()

    // baseEmojis.forEach((emoji) =>
    //     emoji.keywords.forEach((keyword) => {
    //         // console.log(new RegExp(`/:${keyword}:/`).test(text))
    //         // text.replace(new RegExp(`/:${keyword}:/`), emoji.code)
    //     })
    // )
    return text
}

const groupArray = <T,>(array: T[], by: string) =>
    array.reduce((memo, x) => {
        if (!memo[x[by]]) memo[x[by]] = []
        memo[x[by]].push(x)
        return x
    }, {})

function EmojiPopup(props: { children: ReactNode; onSelect: (emoji) => void }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const buttonRef = useRef<HTMLElement>(null)
    const menuRef = useRef<HTMLElement>(null)

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
        <FaSmileWink key="FaSmileWink" size={25} />,
        <FaDog key="FaDog" size={25} />,
        <FaPlane key="FaPlane" size={25} />,
        <FaGamepad key="FaGamepad" size={25} />,
        <FaGem key="FaGem" size={25} />,
        <FaStop key="FaStop" size={25} />,
        <FaFlag key="FaFlag" size={25} />
    ]

    return (
        <>
            <Overlay placement="top-end" ref={menuRef} target={buttonRef} show={open}>
                {(props) => (
                    <div className="EmojiPopup" {...props}>
                        <div className="GroupList">
                            {/* {Object.keys(emojis).map((category, index) => (
                                <Tooltip placement="left" text={<b>{category}</b>} key={index}>
                                    <div className="Group">{categoryIcons[index]}</div>
                                </Tooltip>
                            ))} */}
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
                                {/* {groupArray(emojis, "group").map(emoji => )} */}
                                {/* {Object.keys(emojis.current).map((categoryName, index) => {
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
                                                            onClick={() => props.onSelect(emoji)}
                                                        >
                                                            <Twemoji
                                                                src={
                                                                    emojisList.find(
                                                                        (e) =>
                                                                            e.codes === emoji.code
                                                                    )?.char || ""
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        emoji.keywords.some((kw) =>
                                                            kw.includes(search)
                                                        ) && (
                                                            <Tooltip
                                                                key={emoji.no}
                                                                placement="right"
                                                                text={<b>{emoji.no}</b>}
                                                            >
                                                                <div
                                                                    className="Emoji"
                                                                    key={i}
                                                                    onClick={() =>
                                                                        props.onSelect(emoji)
                                                                    }
                                                                >
                                                                    <Twemoji
                                                                        src={
                                                                            emojisList.find(
                                                                                (e) =>
                                                                                    e.codes ===
                                                                                    emoji.code
                                                                            )?.char || ""
                                                                        }
                                                                    />
                                                                </div>
                                                            </Tooltip>
                                                        )
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })} */}
                            </div>
                        </div>
                    </div>
                )}
            </Overlay>
            <Button
                as="span"
                ref={buttonRef}
                onClick={() => {
                    setOpen(true)
                }}
            >
                {props.children}
            </Button>
        </>
    )
}

export { filterEmojis, EmojiPopup }
