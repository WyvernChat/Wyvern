import React from "react"
import { useLocalStorage } from "../utils"
import Root from "./Root"
import Switch from "./ui/Switch"

export function Home() {
    const [checked, setChecked] = useLocalStorage("settings.notifications", false)
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
            </div>
        </Root>
    )
}
