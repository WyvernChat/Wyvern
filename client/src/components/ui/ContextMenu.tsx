import { Button as RestartButton, Dropdown, Overlay as RestartOverlay } from "@restart/ui"
import FocusTrap from "focus-trap-react"
import React, {
    cloneElement,
    HTMLProps,
    MouseEventHandler,
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
    useState
} from "react"
import classes from "../../scss/ui/contextmenu.module.scss"

const closeContextMenuEvent = new Event("closecontextmenu")

type ContextMenuProps = {
    children: ReactElement
    buttons: ReactNode
} & HTMLProps<HTMLDivElement>

const ContextMenu = ({ children, buttons, ...props }: ContextMenuProps) => {
    const [open, setOpen] = useState(false)
    const [pos, setPos] = useState({
        x: 0,
        y: 0
    })
    const containerRef = useRef<HTMLDivElement>()
    const menuRef = useRef<HTMLDivElement>()
    useEffect(() => {
        const closeListener = () => setOpen(false)
        const escapeListener = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false)
        }
        window.addEventListener("click", closeListener)
        window.addEventListener("contextmenu", closeListener)
        window.addEventListener("keydown", escapeListener)
        window.addEventListener("closecontextmenu", closeListener)
        return () => {
            window.removeEventListener("click", closeListener)
            window.removeEventListener("contextmenu", closeListener)
            window.removeEventListener("keydown", escapeListener)
            window.removeEventListener("closecontextmenu", closeListener)
        }
    })
    return (
        <>
            {cloneElement(children, {
                ref: containerRef,
                onContextMenu(event: MouseEvent) {
                    event.preventDefault()
                    event.stopPropagation()
                    window.dispatchEvent(closeContextMenuEvent)
                    setOpen(true)
                    setPos({
                        x: event.clientX,
                        y: event.clientY
                    })
                },
                ...props
            })}
            <RestartOverlay
                show={open}
                flip
                target={{
                    getBoundingClientRect() {
                        return {
                            width: menuRef.current ? menuRef.current.clientWidth : 2000,
                            height: 0,
                            top: pos.y,
                            right: pos.x,
                            bottom: pos.y,
                            left: pos.x,
                            x: pos.x,
                            y: pos.y,
                            toJSON() {
                                return this
                            }
                        }
                    }
                }}
            >
                {({ className, ...props }) => (
                    <FocusTrap
                        focusTrapOptions={{
                            initialFocus: false,
                            escapeDeactivates: false,
                            allowOutsideClick: true,
                            isKeyBackward: (event) => event.key === "ArrowUp",
                            isKeyForward: (event) => event.key === "ArrowDown"
                        }}
                    >
                        <div className={`${classes.contextmenu} ${className}`} {...props}>
                            <div className={classes.menuitems} ref={menuRef}>
                                {buttons}
                            </div>
                        </div>
                    </FocusTrap>
                )}
            </RestartOverlay>
        </>
    )
}

type ContextMenuButtonProps = {
    children: ReactNode
    onClick: MouseEventHandler
    color?: "gray" | "purple" | "red"
    disabled?: boolean
    dropdown?: boolean
}

const ContextMenuButton = ({ onClick, color, children, dropdown }: ContextMenuButtonProps) => {
    if (dropdown) {
        return (
            <Dropdown.Item
                className={`${classes.menubutton} ${color ? classes[color] : ""}`}
                onClick={onClick}
                onContextMenu={(event) => event.preventDefault()}
            >
                {children}
            </Dropdown.Item>
        )
    }
    return (
        <RestartButton
            className={`${classes.menubutton} ${color ? classes[color] : ""}`}
            onClick={onClick}
            onContextMenu={(event) => event.preventDefault()}
        >
            {children}
        </RestartButton>
    )
}

export type { ContextMenuProps, ContextMenuButtonProps }
export { ContextMenu, ContextMenuButton }
