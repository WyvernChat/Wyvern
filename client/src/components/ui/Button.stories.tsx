import { Meta } from "@storybook/react"
import React from "react"
import Button, { ButtonProps } from "./Button"

export default {
    title: "Button",
    component: Button
} as Meta<typeof Button>

const ButtonTemplate = ({ children, ...props }: ButtonProps) => (
    <Button {...props}>{children}</Button>
)

export const Primary = ButtonTemplate.bind({})
Primary.args = {
    children: "Button",
    variant: "primary",
    type: "button",
    fill: false
}
