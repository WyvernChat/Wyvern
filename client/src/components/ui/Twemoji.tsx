import emojis from "emoji.json"
import React, { DetailedHTMLProps, ImgHTMLAttributes } from "react"

type TwemojiProps = {
    size?: number | string
} & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const emoji = (text: string) => {
    console.log(text)
    return [text]
}

const Twemoji = ({ src, size, ...rest }: TwemojiProps) => {
    const emoji = emojis.find((e) => e.char === src || e.codes === src)
    if (emoji) {
        return (
            <img
                src={`https://twemoji.maxcdn.com/v/latest/svg/${emoji.codes.toLowerCase()}.${"svg"}`}
                tabIndex={-1}
                height={size || 24}
                width={size || 24}
                alt={src}
                {...rest}
            />
        )
    } else {
        return <span {...rest}>:{src}:</span>
    }
}

export type { TwemojiProps }
export { emoji }
export default Twemoji
