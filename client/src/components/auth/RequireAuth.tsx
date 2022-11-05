import React, { ReactElement } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./Auth"

type RequireAuthProps = {
    children: ReactElement
}

const RequireAuth = ({ children }: RequireAuthProps) => {
    const { authenticated } = useAuth()
    const location = useLocation()

    return authenticated ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ path: location.pathname }} />
    )
}

export type { RequireAuthProps }
export default RequireAuth
