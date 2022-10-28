import { Button } from "@restart/ui"
import React, { forwardRef, HTMLAttributes } from "react"
import { LinkProps, useNavigate } from "react-router-dom"

type LinkButtonProps = HTMLAttributes<HTMLButtonElement> & LinkProps

const LinkButton = forwardRef<HTMLButtonElement, LinkButtonProps>(function LinkButton(
    { to, preventScrollReset, relative, replace, state, type, ...rest }: LinkButtonProps,
    ref
) {
    const navigate = useNavigate()
    return (
        <Button
            onClick={() => {
                navigate(to, {
                    preventScrollReset,
                    relative,
                    replace,
                    state
                })
            }}
            ref={ref}
            type={type as "button" | "submit" | "reset"}
            {...rest}
        ></Button>
    )
})

export default LinkButton
