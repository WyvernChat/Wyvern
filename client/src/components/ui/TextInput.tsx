import React, { createElement, HTMLProps } from "react"
import classes from "../../scss/ui/input.module.scss"

type TextInputLabelProps = HTMLProps<HTMLLabelElement> & {
    inline?: boolean
}

const TextInputLabel = ({ children, inline, ...rest }: TextInputLabelProps) => {
    return (
        <label className={`${classes.label} ${inline ? classes.inline : ""}`} {...rest}>
            {children}
        </label>
    )
}

type TextInputProps = HTMLProps<HTMLInputElement> & {
    as?: "textarea" | "input"
    fill?: boolean
}

const TextInput = ({ className, as, fill, ...rest }: TextInputProps) =>
    createElement(as || "input", {
        className: `${classes.textinput} ${fill ? classes.fill : ""} ${className || ""}`,
        ...rest
    })

TextInput.Label = TextInputLabel

export type { TextInputProps, TextInputLabelProps }
export default TextInput
