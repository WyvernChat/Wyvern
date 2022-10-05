import { Overlay } from "@restart/ui"
import { Placement } from "@restart/ui/usePopper"
import React, { ReactNode, useEffect, useRef, useState } from "react"
import { User } from "../../globals"
import { useUserCache } from "../../hooks/user"
import { useLocalStorage } from "../../utils"

export function UserMenu(props: { userId: string; placement: Placement; children: ReactNode }) {
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState<User>(undefined)
    const [cachedUser] = useUserCache()
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
        if (props.userId) {
            cachedUser(props.userId).then(setUser)
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
            <Overlay placement={props.placement} ref={menuRef} target={buttonRef} show={open}>
                {() => (
                    <div className="UserMenu">
                        <h3>
                            <span className="user">
                                {user?.username}
                                <span className="tag">#{user?.tag}</span>
                            </span>
                        </h3>
                        <div>
                            This is the demo bio. You need to add this feature.
                            <input
                                placeholder="Click to add a note"
                                value={notes[props.userId] || ""}
                                onChange={(event) =>
                                    setNotes({ ...notes, [props.userId]: event.target.value })
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
                }}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        setOpen(true)
                    }
                }}
            >
                {props.children}
            </span>
        </>
    )
}
