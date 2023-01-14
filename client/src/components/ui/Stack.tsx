import React, { HTMLProps } from "react"
import classes from "../../scss/ui/stack.module.scss"

type StackSize = 1 | 2 | 3 | 4 | 5

type StackProps = {
    horizontal?: boolean
    size?: StackSize
} & HTMLProps<HTMLDivElement>

const Stack = ({ horizontal, size, children, className, ...rest }: StackProps) => {
    return (
        <div
            {...rest}
            className={`${
                horizontal ? classes[`HStack-${size ?? 1}`] : classes[`VStack-${size ?? 1}`]
            } ${className ?? ""}`}
        >
            {children}
        </div>
    )
}

export type { StackProps, StackSize }
export default Stack
