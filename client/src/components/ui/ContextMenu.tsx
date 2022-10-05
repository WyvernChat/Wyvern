import React, {
    createContext,
    Dispatch,
    MouseEventHandler,
    MutableRefObject,
    ReactNode,
    SetStateAction,
    useContext,
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

    // useEffect(() => {
    //     const openMenu = (event: MouseEvent) => {
    //         const menu = (event.target as Element).closest(".ContextMenuClass") as HTMLElement
    //         const contextMenu = menus.find((m) => m.id === parseInt(menu.dataset.contextmenu))
    //         event.preventDefault()
    //         setMenus((menus) => {
    //             menus.find((m) => m.id === contextMenu.id).open = true
    //             setPosition([event.clientX, event.clientY])
    //             return menus
    //         })
    //         setOpen(true)
    //     }
    //     const hide = () => {
    //         setOpen(false)
    //         setMenus((menus) => menus.map((m) => ({ ...m, open: false })))
    //     }
    //     const hideKey = (event: KeyboardEvent) => {
    //         if (event.key === "Escape") {
    //             setMenus((menus) => menus.map((m) => ({ ...m, open: false })))
    //             setOpen(false)
    //         }
    //     }
    //     document.addEventListener("contextmenu", openMenu)
    //     document.addEventListener("click", hide)
    //     document.addEventListener("keydown", hideKey)
    //     return () => {
    //         document.removeEventListener("contextmenu", openMenu)
    //         document.removeEventListener("click", hide)
    //         document.removeEventListener("keydown", hideKey)
    //     }
    // }, [menus])

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

    // useEffect(() => {
    //     setMenus((menus) => {
    //         setId(menus.length + 1)
    //         menus.push({
    //             ref: menuRef,
    //             buttons: props.buttons,
    //             open: false,
    //             id: id
    //         })
    //         return menus
    //     })
    //     return () => {
    //         setMenus((menus) => {
    //             setId(menus.length + 1)
    //             menus = menus.filter((m) => m.id !== id)
    //             return menus
    //         })
    //     }
    // }, [props.buttons, menuRef, setMenus, id])

    return (
        <div className="ContextMenuClass" ref={menuRef}>
            {props.children}
        </div>
    )
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
