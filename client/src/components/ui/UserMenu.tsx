import { Overlay } from "@restart/ui"
import { Offset, Placement } from "@restart/ui/usePopper"
import React, { ReactNode, useEffect, useRef, useState } from "react"
import { FaCamera, FaCommentAlt, FaPhoneAlt } from "react-icons/fa"
import { useCachedUser } from "../../hooks/user"
import classes from "../../scss/ui/usermenu.module.scss"
import { useLocalStorage } from "../../utils"
import TextInput from "./TextInput"
import { FadeTransition } from "./Transitions"

type UserMenuProps = {
    userId: string
    placement: Placement
    offset: Offset
    children: ReactNode
}

const UserMenu = ({ userId, placement, offset, children }: UserMenuProps) => {
    const [open, setOpen] = useState(false)
    const user = useCachedUser(userId)
    const [notes, setNotes] = useLocalStorage<{ [user: string]: string }>("usernotes", {})

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
            <Overlay
                transition={FadeTransition}
                placement={placement}
                ref={menuRef}
                target={buttonRef}
                offset={offset}
                show={open}
            >
                {(props) => (
                    <div className={classes.usermenu} {...props}>
                        <div className={classes.picture}></div>
                        <div className={classes.section}>
                            <span className={classes.user}>
                                {user?.username}
                                <span className={classes.tag}>#{user?.tag}</span>
                            </span>
                            <div className={classes.separator}></div>
                            <div className={classes.buttons}>
                                <button className={classes.button}>
                                    Message
                                    <FaCommentAlt />
                                </button>
                                <button className={classes.button}>
                                    Audio Call
                                    <FaPhoneAlt />
                                </button>
                                <button className={classes.button}>
                                    Video Call
                                    <FaCamera />
                                </button>
                            </div>
                        </div>
                        <div className={classes.section}>
                            <div className={classes.title}>About Me</div>
                            <div className={classes.aboutme}>
                                This is the demo bio. You need to add this feature.
                            </div>
                            <div className={classes.separator}></div>
                            <div className={classes.title}>Note</div>
                            <TextInput
                                placeholder="Click to add a note"
                                value={notes[userId] || ""}
                                style={{
                                    width: "100%"
                                }}
                                onChange={(event) =>
                                    setNotes({
                                        ...notes,
                                        [userId]: (event.target as HTMLInputElement).value
                                    })
                                }
                            />
                        </div>
                    </div>
                )}
            </Overlay>
            <span
                ref={buttonRef}
                onClick={() => {
                    setOpen(true)
                    console.log("open")
                }}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        setOpen(true)
                    }
                }}
            >
                {children}
            </span>
        </>
    )
}

export default UserMenu
