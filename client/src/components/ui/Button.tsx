import React, { HTMLProps } from "react"

type ButtonProps = {
    variant?: "primary" | "secondary" | "success" | "warning" | "danger"
    type?: "button" | "submit" | "reset"
    fill?: boolean
} & HTMLProps<HTMLButtonElement>

const Button = ({ variant, children, className, fill, ...props }: ButtonProps) => {
    return (
        <button
            className={`WyvernButton ${variant ?? "primary"} ${fill ? "fill" : ""} ${
                className || ""
            }`}
            {...props}
        >
            {children}
        </button>
    )
}

export type { ButtonProps }
export default Button
