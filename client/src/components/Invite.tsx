import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGlobalState } from "../App"
import { Guild } from "../globals"

export function Invite() {
    const [token] = useGlobalState("token")
    const [user] = useGlobalState("user")
    const [guild, setGuild] = useState<Guild>(undefined)
    const [inviteLoading, setInviteLoading] = useState(false)
    const { inviteCode } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`/api/guilds/invites/${inviteCode}`).then((response) => {
            setGuild(response.data)
        })
    }, [inviteCode])
    return (
        <div className="Login-Card">
            <div className="text-center">
                <h4>You&apos;ve been invited to a Wyvern Server!</h4>
                <span
                    style={{
                        color: "gray"
                    }}
                >
                    Click join to accept your invite to{" "}
                    <strong>
                        <a
                            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {guild?.name}
                        </a>
                    </strong>
                </span>
            </div>
            <hr />
            <div className="d-flex justify-content-center">
                <button
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
                                            authorization: token
                                        }
                                    }
                                )
                                .then((response) => {
                                    navigate(`/channels/${response.data.id}`)
                                })
                        }
                    }}
                    style={{
                        width: "50%"
                    }}
                >
                    Join
                </button>
            </div>
        </div>
    )
}
