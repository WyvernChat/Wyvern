import React, { ReactNode } from "react"
import Sidebar from "./Sidebar"

type RootProps = {
    children: ReactNode
    hideGuilds?: boolean
}

const Root = ({ children, hideGuilds }: RootProps) => {
    return (
        <div className="horizontal">
            <Sidebar hide={hideGuilds} />
            {children}
        </div>
    )
}

export default Root
