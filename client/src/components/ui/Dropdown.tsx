import { useDropdownMenu, UseDropdownMenuOptions } from "@restart/ui"
import React, { ReactNode, useLayoutEffect } from "react"

type DropdownMenuProps = {
    role: string
    options: UseDropdownMenuOptions
    children: ReactNode
}

const DropdownMenu = ({ role, children, options }: DropdownMenuProps) => {
    const [props, { toggle, show, popper }] = useDropdownMenu(options)

    useLayoutEffect(() => {
        if (show) popper.update()
    }, [show])

    return (
        <div
            {...props}
            role={role}
            style={{
                display: show ? "flex" : "none",
                zIndex: 10
            }}
        >
            {children}
        </div>
    )
}
