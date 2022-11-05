import React, { ReactElement } from "react"

type CardProps = {
    children: ReactElement
}

const Card = ({ children }: CardProps) => {
    return (
        <div className={`Card`}>
            <div className="Card-Body">{children}</div>
        </div>
    )
}

export default Card
