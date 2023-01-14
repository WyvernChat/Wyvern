import { Meta } from "@storybook/react"
import React from "react"
import "../../scss/main.scss"
import MessageInput, { MessageInputProps } from "./MessageInput"

export default {
    title: "MessageInput",
    component: MessageInput
} as Meta<typeof MessageInput>

const MessageInputTemplate = ({ ...props }: MessageInputProps) => <MessageInput {...props} />

export const Default = MessageInputTemplate.bind({})
Default.args = {
    placeholder: "",
    onSubmit(text: string) {
        window.alert(text)
    },
    min: 0,
    max: 200,
    lengthWarning: 180
}
