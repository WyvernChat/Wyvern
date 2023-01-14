import React from "react"
import classes from "../../scss/ui/message.module.scss"

type PlaceholderMessageProps = {
    messageLength: number
    showAvatar: boolean
}

const PlaceholderMessage = ({ messageLength, showAvatar }: PlaceholderMessageProps) => {
    return (
        <div className={classes.message}>
            {showAvatar ? (
                <>
                    <div className={classes.avatar}></div>
                    <div>
                        <span className={classes.user}></span>
                    </div>
                </>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export type { PlaceholderMessageProps }
export default PlaceholderMessage
