import { Meta } from "@storybook/react"
import React from "react"
import Markdown, { MarkdownProps } from "./Markdown"

export default {
    title: "Markdown",
    component: Markdown
} as Meta<typeof Markdown>

const MarkdownTemplate = ({ ...props }: MarkdownProps) => <Markdown {...props} />

export const Default = MarkdownTemplate.bind({})
Default.args = {
    text: "**Hi**, what's up?"
}
