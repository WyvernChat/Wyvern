import axios from "axios"
import React, { useState } from "react"
import { Button, Stack } from "react-bootstrap"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useGlobalState } from "../App"
import { useAlert } from "./Alerts"

export function Login() {
    const [token, setToken] = useGlobalState("token")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const alert = useAlert()

    return (
        <div className="Login-Card">
            <form
                onSubmit={async (event) => {
                    event.preventDefault()
                    const result = await axios.post("/api/auth/login", {
                        email: email,
                        password: password
                    })
                    if (result.status >= 400) {
                        console.log(result.data.error)
                        alert({
                            text: result.data.error,
                            type: "danger"
                        })
                    } else if (result.status === 200) {
                        setToken(result.data.token)
                        if (searchParams.has("redirect")) {
                            window.location.href = searchParams.get("redirect")
                        } else {
                            navigate("/")
                        }
                        alert({
                            text: "Logged in!",
                            type: "success"
                        })
                    }
                }}
                noValidate
                autoComplete="off"
            >
                <div className="text-center">
                    <h4>Hey, welcome back!</h4>
                    <span
                        style={{
                            color: "gray"
                        }}
                    >
                        Login with your email and password.
                    </span>
                </div>
                <Stack gap={4}>
                    <div className="Input-Form">
                        <div>Email</div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="Input-Form">
                        <div>Password</div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="Input-Form">
                        <Button
                            type="submit"
                            variant="primary"
                            style={{
                                width: "100%"
                            }}
                        >
                            Login
                        </Button>
                        <div>
                            Don't have an account? <Link to="/register">Register</Link>
                        </div>
                    </div>
                </Stack>
            </form>
        </div>
    )
}
