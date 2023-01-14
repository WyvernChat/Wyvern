import React, { HTMLProps } from "react"

import classes from "../../scss/ui/button.module.scss"

type ButtonProps = {
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark"
    type?: "button" | "submit" | "reset"
    fill?: boolean
} & HTMLProps<HTMLButtonElement>

const Button = ({ variant, children, className, fill, ...props }: ButtonProps) => {
    return (
        <button
            className={`${classes.button} ${classes[variant] ?? classes.primary} ${
                fill ? classes.fill : ""
            } ${className || ""}`}
            {...props}
        >
            {children}
        </button>
    )
}

export type { ButtonProps }
export default Button
