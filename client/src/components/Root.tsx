import React, { ReactNode } from "react"
import { Sidebar } from "./Sidebar"

export function Root(props: { children: ReactNode }) {
    return (
        <div className="horizontal">
            <Sidebar />
            {props.children}
        </div>
    )
}
