import axios from "axios"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    return (
        <div className="Login-Card">
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
                noValidate
                autoComplete="off"
            >
                <div className="text-center">
                    <h4>Create an account</h4>
                </div>
                <div className="VStack-4">
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
                        <div>Username</div>
                        <input
                            id="username"
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        <button
                            type="submit"
                            style={{
                                width: "100%"
                            }}
                        >
                            Login
                        </button>
                        <div>
                            Already have an account? <Link to="/login">Login</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
