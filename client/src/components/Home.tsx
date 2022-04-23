import React, { useState } from "react"
import { Form } from "react-bootstrap"
import { Root } from "./Root"

export function Home() {
    const [pushNotifications, setPushNotifications] = useState(false)
    return (
        <Root>
            <Form>
                <Form.Group>
                    <Form.Label>Push Notifications</Form.Label>
                    <Form.Check
                        type="switch"
                        checked={pushNotifications}
                        onChange={(event) => setPushNotifications(event.target.checked)}
                    />
                    <Form.Text>Send notifications to supporting browsers</Form.Text>
                </Form.Group>
            </Form>
        </Root>
    )
}
