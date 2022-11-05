import axios from "axios"
import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAlert } from "./Alerts"
import { useAuth } from "./auth/Auth"
import Button from "./ui/Button"
import Card from "./ui/Card"
import TextInput from "./ui/TextInput"

export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { state } = useLocation()
    const navigate = useNavigate()
    const alert = useAlert()
    const { login } = useAuth()

    return (
        <Card>
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
                        login(result.data.token).then(() => {
                            navigate(state?.path ?? "/")
                            alert({
                                text: "Logged in!",
                                type: "success"
                            })
                        })
                    }
                }}
                className="fill-x"
                noValidate
                autoComplete="off"
            >
                <div className="text-center">
                    <h2>Hey, welcome back!</h2>
                    <span
                        style={{
                            color: "gray"
                        }}
                    >
                        Log in with your email and password.
                    </span>
                </div>
                <div className="VStack-4">
                    <TextInput.Label>Email</TextInput.Label>
                    <TextInput
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                    />
                    <TextInput.Label>Password</TextInput.Label>
                    <TextInput
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                    />

                    <Button type="submit" fill>
                        Log In
                    </Button>
                    <div>
                        Don&apos;t have an account? <Link to="/register">Register</Link>
                    </div>
                </div>
            </form>
        </Card>
    )
}
