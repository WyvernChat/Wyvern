import React from "react"
import { CSSTransition } from "react-transition-group"
import { CSSTransitionProps } from "react-transition-group/CSSTransition"

const FadeTransition = ({ children, ...props }: CSSTransitionProps) => (
    <CSSTransition {...props} timeout={300} classNames="fade">
        {children}
    </CSSTransition>
)

export { FadeTransition }
