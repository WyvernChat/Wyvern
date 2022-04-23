import React, { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useGlobalState } from "../App"
import { useAuth } from "./Auth"
import { Guild } from "./guild/Guild"
import { Home } from "./Home"
import { Index } from "./Index"
import { Invite } from "./Invite"
import { Login } from "./Login"
import { Register } from "./Register"
import { Voice } from "./Voice"

export function Router() {
    const { login } = useAuth()
    const [token] = useGlobalState("token")

    useEffect(() => {
        if (token.length > 0) {
            login(token)
        }
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="channels">
                    <Route path="@me" element={<Home />} />
                    <Route path=":guildId" element={<Guild />}>
                        <Route path=":channelId" element={<Guild />} />
                    </Route>
                </Route>
                <Route path="invite">
                    <Route path=":inviteCode" element={<Invite />} />
                </Route>
                <Route path="voice" element={<Voice />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<p>404</p>} />
            </Routes>
        </BrowserRouter>
    )
}
