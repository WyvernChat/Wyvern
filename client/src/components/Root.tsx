import React, { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./Auth"
import { Sidebar } from "./Sidebar"

export function Root(props: { children: ReactNode }) {
    const { authenticated } = useAuth()

    return authenticated ? (
        <div className="horizontal">
            <Sidebar />
            {props.children}
        </div>
    ) : (
        <Navigate to="/login" />
    )
}
