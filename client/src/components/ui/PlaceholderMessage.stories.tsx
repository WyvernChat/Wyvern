import { Meta } from "@storybook/react"
import React from "react"
import PlaceholderMessage, { PlaceholderMessageProps } from "./PlaceholderMessage"

export default {
    title: "PlaceholderMessage",
    component: PlaceholderMessage
} as Meta<typeof PlaceholderMessage>

const PlaceholderMessageTemplate = ({ ...props }: PlaceholderMessageProps) => (
    <PlaceholderMessage {...props} />
)

export const Placeholder = PlaceholderMessageTemplate.bind({})
Placeholder.args = {
    messageLength: 20,
    showAvatar: true
}
