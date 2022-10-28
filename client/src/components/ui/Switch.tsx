import React, { HTMLProps, useId, useRef } from "react"

const Switch = ({ className, id, ...rest }: HTMLProps<HTMLInputElement>) => {
    const checkboxId = useId()
    const checkboxRef = useRef<HTMLInputElement>()
    return (
        <>
            <input
                className={`Switch ${className ?? ""}`}
                type="checkbox"
                id={id || checkboxId}
                ref={checkboxRef}
                {...rest}
            />
            <label
                className="Switch"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        checkboxRef.current.click()
                    }
                }}
                htmlFor={id || checkboxId}
            />
        </>
    )
}

export default Switch
