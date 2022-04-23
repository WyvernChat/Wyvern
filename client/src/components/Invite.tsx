import axios from "axios"
import React, { useEffect, useState } from "react"
import { Button, Stack } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { useGlobalState } from "../App"
import { Guild } from "../globals"
import { getUserData } from "../usermanagement"

export function Invite() {
    const [token] = useGlobalState("token")
    const [user, setUser] = useGlobalState("user")
    const [guild, setGuild] = useState<Guild>(undefined)
    const [inviteLoading, setInviteLoading] = useState(false)
    const { inviteCode } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.get(`/api/guilds/invites/${inviteCode}`).then((response) => {
                setGuild(response.data)
            })
        } else {
            const searchParams = new URLSearchParams()
            searchParams.set("redirect", window.location.href)
            navigate({
                pathname: "/login",
                search: searchParams.toString()
            })
        }
    }, [])
    return (
        <div className="Login-Card">
            <div className="text-center">
                <h4>You've been invited to a Wyvern Server!</h4>
                <span
                    style={{
                        color: "gray"
                    }}
                >
                    Click join to accept your invite to{" "}
                    <strong>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
                            {guild?.name}
                        </a>
                    </strong>
                </span>
            </div>
            <hr />
            <Stack gap={3}>
                <div className="d-flex justify-content-center">
                    <Button
                        variant="primary"
                        disabled={inviteLoading}
                        onClick={() => {
                            if (user && guild) {
                                setInviteLoading(true)
                                axios
                                    .post(
                                        `/api/guilds/${guild.id}/join`,
                                        {},
                                        {
                                            headers: {
                                                authorization: localStorage.getItem("token")
                                            }
                                        }
                                    )
                                    .then((response) => {
                                        navigate(`/channels/${response.data.id}`)
                                        getUserData(token).then(setUser)
                                    })
                            }
                        }}
                        style={{
                            width: "50%"
                        }}
                    >
                        Join
                    </Button>
                </div>
            </Stack>
        </div>
    )
}
