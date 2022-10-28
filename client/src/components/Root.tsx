import React, { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./Auth"
import Sidebar from "./Sidebar"

type RootProps = {
    children: ReactNode
    hideGuilds?: boolean
}

const Root = ({ children, hideGuilds }: RootProps) => {
    const { authenticated } = useAuth()
    const location = useLocation()

    return authenticated ? (
        <div className="horizontal">
            <Sidebar hide={hideGuilds} />
            {children}
        </div>
    ) : (
        <Navigate
            to={{
                pathname: "/login",
                search: new URLSearchParams({ redirect: location.pathname }).toString()
            }}
        />
    )
}

export default Root
