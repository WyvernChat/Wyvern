import React, { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./Auth"
import { Sidebar } from "./Sidebar"

export function Root(props: { children: ReactNode }) {
    const { authenticated } = useAuth()
    const location = useLocation()

    return authenticated ? (
        <div className="horizontal">
            <Sidebar />
            {props.children}
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
