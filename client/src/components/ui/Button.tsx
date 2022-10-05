import React, { HTMLProps } from "react"

type ButtonProps = {
    variant?: "primary" | "secondary" | "success" | "warning" | "danger"
    type?: "button" | "submit" | "reset"
} & HTMLProps<HTMLButtonElement>

const Button = ({ variant, children, className, ...props }: ButtonProps) => {
    return (
        <button className={`${className} WyvernButton ${variant ?? "primary"}`} {...props}>
            {children}
        </button>
    )
}

export { Button, ButtonProps }
