import axios from "axios"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "./ui/Button"
import Card from "./ui/Card"
import Stack from "./ui/Stack"
import TextInput from "./ui/TextInput"

export function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    return (
        <Card>
            <form
                onSubmit={async (event) => {
                    event.preventDefault()
                    const result = await axios.post("/api/auth/register", {
                        email: email,
                        password: password,
                        username: username
                    })
                    if (result.status >= 400) {
                        console.log(result.data.error)
                    } else if (result.status === 201) {
                        navigate("/login")
                    }
                }}
                className="fill-x"
                noValidate
                autoComplete="off"
            >
                <div className="text-center">
                    <h2>Create an account</h2>
                    <span
                        style={{
                            color: "gray"
                        }}
                    >
                        Register with an email, password, and username.
                    </span>
                </div>
                <Stack size={4}>
                    <div>
                        <TextInput.Label>Email</TextInput.Label>
                        <TextInput
                            id="email"
                            type="email"
                            fill
                            value={email}
                            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <TextInput.Label>Username</TextInput.Label>
                        <TextInput
                            id="username"
                            type="username"
                            fill
                            value={username}
                            onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <TextInput.Label>Password</TextInput.Label>
                        <TextInput
                            id="password"
                            type="password"
                            fill
                            value={password}
                            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <Button type="submit" fill>
                            Register
                        </Button>
                        <div>
                            Already have an account? <Link to="/login">Login</Link>
                        </div>
                    </div>
                </Stack>
            </form>
        </Card>
    )
}
