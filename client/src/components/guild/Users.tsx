import React, { useEffect, useState } from "react"

export function Users(props: { guildId: string }) {
    const [users, setUsers] = useState<{ user: string; online: boolean }[]>([])

    useEffect(() => {
        setUsers(
            users.concat(
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                },
                {
                    online: true,
                    user: "1"
                },
                {
                    online: false,
                    user: "2"
                },
                {
                    online: false,
                    user: "3"
                },
                {
                    online: true,
                    user: "4"
                }
            )
        )
    }, [])
    return (
        <div className="UserBar">
            <div className="Title">Online - {users.filter((u) => u.online).length}</div>
            <div>
                {users
                    .filter((u) => u.online)
                    .map((u, index) => (
                        <div key={index} className="user">
                            <img
                                src="/img/logos/WyvernLogoGrayscale-512x512.png"
                                className="avatar"
                            />
                            <span className="username">User {u.user}</span>
                        </div>
                    ))}
            </div>
            <div className="Title">Offline - {users.filter((u) => !u.online).length}</div>
            <div>
                {users
                    .filter((u) => !u.online)
                    .map((u, index) => (
                        <div key={index} className="user">
                            <img
                                src="/img/logos/WyvernLogoGrayscale-512x512.png"
                                className="avatar"
                            />
                            <span className="username">User {u.user}</span>
                        </div>
                    ))}
            </div>
        </div>
    )
}
