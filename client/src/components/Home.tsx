import axios from "axios"
import React from "react"
import { pushSubscription } from "../pushManager"
import { useLocalStorage, useTitle } from "../utils"
import Root from "./Root"
import Button from "./ui/Button"
import Switch from "./ui/Switch"

export function Home() {
    const [checked, setChecked] = useLocalStorage("settings.notifications", false)

    useTitle("Wyvern | Friends")

    return (
        <Root>
            <div>
                <Switch
                    checked={checked}
                    onChange={() => {
                        setChecked(false)
                        if (!checked) {
                            console.log("requesting")
                            Notification.requestPermission().then((result) => {
                                if (result === "granted") {
                                    setChecked(true)
                                }
                            })
                        }
                    }}
                />
                <Button
                    onClick={() => {
                        axios.post("/api/notifications/sendNotification", {
                            subscription: pushSubscription,
                            payload: JSON.stringify({ body: "test" }),
                            ttl: 0
                        })
                    }}
                >
                    Show Notification
                </Button>
            </div>
        </Root>
    )
}
