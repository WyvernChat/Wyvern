import React, { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useGlobalState } from "../App"
import { useChannels } from "../hooks/channel"
import { useGuilds } from "../hooks/guild"
import { useAuth } from "./auth/Auth"
import RequireAuth from "./auth/RequireAuth"
import Guild from "./guild/Guild"
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
    }, [login, token])

    useGuilds(token)
    useChannels(token)

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="channels">
                    <Route
                        path="@me"
                        element={
                            <RequireAuth>
                                <Home />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path=":guildId"
                        element={
                            <RequireAuth>
                                <Guild />
                            </RequireAuth>
                        }
                    >
                        <Route
                            path=":channelId"
                            element={
                                <RequireAuth>
                                    <Guild />
                                </RequireAuth>
                            }
                        />
                    </Route>
                </Route>
                <Route path="invite">
                    <Route
                        path=":inviteCode"
                        element={
                            <RequireAuth>
                                <Invite />
                            </RequireAuth>
                        }
                    />
                </Route>
                <Route path="voice" element={<Voice />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<p>404</p>} />
            </Routes>
        </BrowserRouter>
    )
}
