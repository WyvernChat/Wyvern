import React, { createElement, FormEvent, HTMLProps, useEffect, useRef, useState } from "react"
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

const TextInput = ({ className, as, fill, onChange, value, ...rest }: TextInputProps) => {
    const [cursor, setCursor] = useState<[number, number]>([0, 0])
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>()

    useEffect(() => {
        if (inputRef.current && inputRef.current.type === "text")
            inputRef.current.setSelectionRange(cursor[0], cursor[1])
    }, [cursor, inputRef, value])

    return createElement(as || "input", {
        className: `${classes.textinput} ${fill ? classes.fill : ""} ${className || ""}`,
        ref: inputRef,
        value,
        onChange(event: FormEvent<HTMLInputElement>) {
            setCursor([inputRef.current.selectionStart, inputRef.current.selectionEnd])
            onChange && onChange(event)
        },
        ...rest
    })
}

TextInput.Label = TextInputLabel

export type { TextInputProps, TextInputLabelProps }
export default TextInput
