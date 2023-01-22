import emojis from "emoji-dictionary"
import React, { DetailedHTMLProps, ImgHTMLAttributes } from "react"
import classes from "../../scss/ui/twemoji.module.scss"
import { Tooltip } from "./Tooltip"

type TwemojiProps = {
    size?: number | string | "auto"
    tooltip?: boolean
} & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const Twemoji = ({ src, size, tooltip, ...rest }: TwemojiProps) => {
    const emoji = emojis.unicode.includes(src || "") ? src : emojis.getUnicode(src)
    if (emoji) {
        return (
            <Tooltip
                text={
                    <div>
                        <Twemoji src={src} size={48} /> <strong>:{src}:</strong>
                    </div>
                }
                hide={!tooltip}
                placement="top"
                showHover
            >
                <img
                    src={`https://twemoji.maxcdn.com/v/latest/svg/${emoji
                        .codePointAt(0)
                        .toString(16)}.${"svg"}`}
                    tabIndex={-1}
                    height={size || 24}
                    width={size || 24}
                    alt={emoji}
                    className={classes.emoji}
                    onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "all"
                        event.dataTransfer.setData("text/plain", `:${emojis.getName(emoji)}:`)
                    }}
                    {...rest}
                />
            </Tooltip>
        )
    } else {
        return <span {...rest}>:{src}:</span>
    }
}

export type { TwemojiProps }
export default Twemoji
