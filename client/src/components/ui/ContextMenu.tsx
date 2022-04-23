import React, {
    createContext,
    Dispatch,
    MouseEventHandler,
    MutableRefObject,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState
} from "react"

interface ContextMenuConfig {
    ref: MutableRefObject<Node>
    buttons: ReactNode
    open: boolean
    id?: number
}

const ContextMenuContext =
    createContext<
        [
            [ContextMenuConfig[], Dispatch<SetStateAction<ContextMenuConfig[]>>],
            [boolean, Dispatch<SetStateAction<boolean>>],
            [[number, number], Dispatch<SetStateAction<[number, number]>>]
        ]
    >(null)

export function ContentMenuProvider(props: { children: ReactNode }) {
    const [menus, setMenus] = useState<ContextMenuConfig[]>([])
    const [open, setOpen] = useState(false)
    const [position, setPosition] = useState<[number, number]>([0, 0])

    const openMenu = (event: MouseEvent, menu: ContextMenuConfig) => {
        if (menu.ref.current.contains(event.target as Node)) {
            event.preventDefault()
            setMenus((menus) => {
                menus.find((m) => m.id === menu.id).open = true
                setPosition([event.clientX, event.clientY])
                return menus
            })
            setOpen(true)
        }
    }
    const hide = (event: MouseEvent, menu: ContextMenuConfig) => {
        if (!menu.ref.current.contains(event.target as Node)) {
            event.preventDefault()
            setMenus((menus) => {
                menus.find((m) => m.id === menu.id).open = false
                return menus
            })
            setOpen(false)
        }
    }
    const hideKey = (event: KeyboardEvent, menu: ContextMenuConfig) => {
        if (event.key === "Escape" && menu) {
            event.preventDefault()
            setMenus((menus) => {
                menus.find((m) => m.id === menu.id).open = false
                return menus
            })
            setOpen(false)
        }
    }

    useEffect(() => {
        menus.forEach((menu) => {
            document.addEventListener("contextmenu", (event: MouseEvent) => {
                openMenu(event, menu)
            })
            document.addEventListener("contextmenu", (event: MouseEvent) => {
                hide(event, menu)
            })
            document.addEventListener("click", (event: MouseEvent) => {
                hide(event, menu)
            })
            document.addEventListener("keydown", (event: KeyboardEvent) => {
                hideKey(event, menu)
            })
        })
        console.log(menus.length)
        return () => {
            menus.forEach((menu) => {
                document.removeEventListener("contextmenu", (event: MouseEvent) => {
                    openMenu(event, menu)
                })
                document.removeEventListener("contextmenu", (event: MouseEvent) => {
                    hide(event, menu)
                })
                document.removeEventListener("click", (event: MouseEvent) => {
                    hide(event, menu)
                })
                document.removeEventListener("keydown", (event: KeyboardEvent) => {
                    hideKey(event, menu)
                })
            })
        }
    }, [menus])

    return (
        <ContextMenuContext.Provider
            value={[
                [menus, setMenus],
                [open, setOpen],
                [position, setPosition]
            ]}
        >
            <div
                style={{
                    display: open ? "block" : "none",
                    top: position[1],
                    left: position[0]
                }}
                className="ContextMenu"
            >
                {menus.map((menu, index) => {
                    if (menu.open) {
                        return <div key={index}>{menu.buttons}</div>
                    }
                })}
            </div>
            {props.children}
        </ContextMenuContext.Provider>
    )
}

export function ContextMenu(props: { children: ReactNode; buttons: ReactNode }) {
    const context = useContext(ContextMenuContext)
    const menuRef = useRef<HTMLDivElement>(null)
    const [menus, setMenus] = context[0]
    const [open, setOpen] = context[1]
    const [position, setPosition] = context[2]
    const [id, setId] = useState(0)

    useEffect(() => {
        setMenus((menus) => {
            setId(menus.length + 1)
            menus.push({
                ref: menuRef,
                buttons: props.buttons,
                open: false,
                id: id
            })
            return menus
        })
        return () => {
            setMenus((menus) => {
                setId(menus.length + 1)
                menus.filter((m) => m.id !== id)
                return menus
            })
        }
    }, [props.buttons, menuRef])

    return <div ref={menuRef}>{props.children}</div>
}

export function ContextMenuButton(props: {
    children: ReactNode
    onClick: MouseEventHandler
    color?: "gray" | "blue" | "red"
    disabled?: boolean
}) {
    return (
        <div
            className={`ContextMenuButton ${props.color ? props.color : "gray"}`}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    )
}
