import { Placement } from "@popperjs/core"
import { Overlay as RestartOverlay } from "@restart/ui"
import React, { cloneElement, ReactElement, useRef, useState } from "react"
import { FadeTransition } from "./Transitions"

type TooltipProps = {
    children: ReactElement
    text: ReactElement
    placement?: Placement
    hide?: boolean
}

const Tooltip = ({ children, placement, text, hide }: TooltipProps) => {
    const ref = useRef<HTMLElement>()
    const [hover, setHover] = useState(false)
    return (
        <>
            {cloneElement(children, {
                ref,
                onMouseEnter: () => setHover(true),
                onMouseLeave: () => setHover(false)
            })}
            <RestartOverlay
                show={!hide && hover}
                placement={placement}
                target={ref.current}
                transition={FadeTransition}
            >
                {(props, { arrowProps, popper }) => (
                    <span className="Tooltip" {...props}>
                        <div
                            {...arrowProps}
                            style={{
                                ...arrowProps.style,
                                left: popper.placement === "right" ? 4 : null,
                                right: popper.placement === "left" ? 4 : null,
                                bottom: popper.placement === "top" ? 4 : null,
                                top: popper.placement === "bottom" ? 4 : null
                            }}
                            className="Tooltip-Arrow"
                        ></div>
                        <div
                            className="Tooltip-Content"
                            style={{
                                marginLeft: popper.placement === "right" ? 8 : null,
                                marginRight: popper.placement === "left" ? 8 : null,
                                marginBottom: popper.placement === "top" ? 8 : null,
                                marginTop: popper.placement === "bottom" ? 8 : null
                            }}
                        >
                            {text}
                        </div>
                    </span>
                )}
            </RestartOverlay>
        </>
    )
}

export { Tooltip, TooltipProps }
