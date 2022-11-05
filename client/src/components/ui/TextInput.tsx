import React, { createElement, HTMLProps } from "react"

type TextInputLabelProps = HTMLProps<HTMLLabelElement> & {
    inline?: boolean
}

const TextInputLabel = ({ children, inline, ...rest }: TextInputLabelProps) => {
    return (
        <label className="Label" {...rest}>
            {children}
        </label>
    )
}

type TextInputProps = HTMLProps<HTMLInputElement> & {
    as?: "textarea" | "input"
}

const TextInput = ({ className, as, ...rest }: TextInputProps) =>
    createElement(as || "input", {
        className: `TextInput ${className || ""}`,
        ...rest
    })

TextInput.Label = TextInputLabel

export type { TextInputProps, TextInputLabelProps }
export default TextInput
