import React, { useCallback, useEffect, useRef, useState } from "react"
import { FaPlusCircle } from "react-icons/fa"
import { SingleASTNode } from "simple-markdown-2"
import { createEditor, Descendant, Range, Text, type BaseEditor } from "slate"
import { withHistory, type HistoryEditor } from "slate-history"
import {
    DefaultElement,
    Editable,
    RenderElementProps,
    RenderLeafProps,
    Slate,
    withReact,
    type ReactEditor
} from "slate-react"
import classes from "../../scss/ui/messageinput.module.scss"
import { EmojiPopup } from "./EmojiPopup"
import { parseMarkdown } from "./Markdown"
import Twemoji from "./Twemoji"

type MessageInputProps = {
    placeholder?: string
    onSubmit: (text: string) => void
    min?: number
    max?: number
    lengthWarning?: number
}

type ParagraphElement = {
    type: "paragraph"
    children: CustomText[]
}

type CustomElement = {
    type: "paragraph" | "code"
    children: CustomText[]
}
type CustomText = {
    text: string
    bold?: true
    italic?: true
    underline?: true
    strike?: true
    spoiler?: true
}

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
        Element: CustomElement
        Text: CustomText
    }
}

const MessageInput = ({ placeholder, onSubmit, min, max, lengthWarning }: MessageInputProps) => {
    const [message, setMessage] = useState("")
    const [editor] = useState(() => withReact(withHistory(createEditor())))
    const [editorHeight, setEditorHeight] = useState(0)

    const defaultValue: Descendant[] = [
        {
            type: "paragraph",
            children: [
                {
                    text: "Default message?"
                }
            ]
        }
    ]

    const decorate = useCallback(([node, path]) => {
        const ranges = []
        if (!Text.isText(node)) {
            return ranges
        }

        const getLength = (token: string | SingleASTNode): number => {
            if (typeof token === "string") {
                return token.length
            } else if (typeof token.content === "string") {
                return token.content.length
            } else if (token.content instanceof Array) {
                return token.content.reduce((l, t) => l + getLength(t), 0)
            } else {
                return 0
            }
        }

        const tokens = parseMarkdown(node.text)
        let start = 0

        const parseTokens = (tokens: SingleASTNode[]) => {
            for (const token of tokens) {
                console.log(token)
                const length = getLength(token)
                const end = start + length

                if (token.content instanceof Array) {
                    console.log("parsing", token.content)
                    parseTokens(token.content)
                } else {
                    ranges.push({
                        [token.type]: true,
                        anchor: { path, offset: start },
                        focus: { path, offset: end }
                    })
                    console.log("wadoamk")
                    console.log(
                        Range.isRange({
                            [token.type]: true,
                            anchor: { path, offset: start },
                            focus: { path, offset: end }
                        })
                    )
                    start = end
                }
            }
        }
        parseTokens(tokens)
        console.log({ ranges, tokens })

        return ranges
    }, [])

    const renderElement = useCallback((props: RenderElementProps) => {
        switch (props.element.type) {
            case "code":
                break
            default:
                return <DefaultElement {...props} />
        }
    }, [])

    // const resizeEditor = () => {
    //     setEditorHeight(0)
    //     const { scrollHeight } = messageInputRef.current
    //     const lineHeight = 20
    //     const lines = Math.floor(scrollHeight / lineHeight)
    //     const maxLines = Math.floor(window.innerHeight / 45)
    //     messageInputRef.current.style.height =
    //         lines <= maxLines ? lines * 20 + "px" : maxLines * 20 + "px"
    // }

    return (
        <Slate
            editor={editor}
            value={defaultValue}
            onChange={(value: Descendant[]) => {
                const isChange = editor.operations.some((op) => "set_selection" !== op.type)
                if (isChange) {
                    const content = JSON.stringify(value)
                    console.log(content)
                }
            }}
        >
            <div className={classes.messagecontainer}>
                <div className={classes.buttons}>
                    <button className={classes.button}>
                        <FaPlusCircle size={20} />
                    </button>
                </div>
                <Editable
                    decorate={decorate}
                    renderLeaf={(props) => <Leaf {...props} />}
                    placeholder={"Placeholder"}
                    className={classes.textarea}
                    renderPlaceholder={() => {
                        return <div></div>
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault()
                            editor.insertText("\n")
                        }
                    }}
                    style={{}}
                />
                <div className={classes.buttons}>
                    <EmojiPopup
                        onSelect={(emoji) => {
                            editor.insertText(`:${emoji.keywords[0]}:`)
                        }}
                    >
                        <EmojiCarousel />
                    </EmojiPopup>
                    {/* <div
                    className={`${classes.lengthindicator} ${
                        currentMessage.length > (max ?? 2000) ? classes.toolong : ""
                    }`}
                >
                    {currentMessage.length >= (max ?? 2000) - (lengthWarning ?? 200)
                        ? (max ?? 2000) - currentMessage.length
                    : ""} */}
                </div>
            </div>
        </Slate>
    )
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    return (
        <span
            {...attributes}
            style={{
                fontWeight: leaf.bold ? "bold" : "normal"
            }}
        >
            {children}
        </span>
    )
}

const MessageInputTextarea = ({
    placeholder,
    onSubmit,
    min,
    max,
    lengthWarning
}: MessageInputProps) => {
    const [currentMessage, setCurrentMessage] = useState("")

    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const keyListener = (event: KeyboardEvent) => {
        if (
            [
                event.ctrlKey,
                event.metaKey,
                event.altKey,
                event.key === "Tab",
                event.key === "Backspace",
                event.key === "CapsLock",
                event.key === "Enter",
                event.key === "Escape",
                event.key.startsWith("Arrow")
            ].every((v) => v !== true)
        ) {
            if (document.activeElement === document.body) {
                if (!event.shiftKey) {
                    const [start, end] = [
                        messageInputRef.current.selectionStart,
                        messageInputRef.current.selectionEnd
                    ]
                    messageInputRef.current.setRangeText(event.key, start, end, "select")
                    setCurrentMessage(messageInputRef.current.value)
                }
                messageInputRef.current.focus()
            }
        }
    }

    const resizeTextarea = () => {
        messageInputRef.current.style.height = "0px"
        const { scrollHeight } = messageInputRef.current
        const lineHeight = 20
        const lines = Math.floor(scrollHeight / lineHeight)
        const maxLines = Math.floor(window.innerHeight / 45)
        messageInputRef.current.style.height =
            lines <= maxLines ? lines * 20 + "px" : maxLines * 20 + "px"
    }

    const pasteListener = () => {
        // console.log(document.activeElement)
        // if (document.activeElement.tagName !== "body") return
        // const paste = event.clipboardData.getData("text")
        // const [start, end] = [
        //     messageInputRef.current.selectionStart,
        //     messageInputRef.current.selectionEnd
        // ]
        // messageInputRef.current.setRangeText(paste, start, end, "select")
        // messageInputRef.current.focus()
    }

    useEffect(() => {
        document.addEventListener("keydown", keyListener)
        document.addEventListener("paste", pasteListener)
        document.addEventListener("resize", resizeTextarea)
        return () => {
            document.removeEventListener("keydown", keyListener)
            document.removeEventListener("paste", pasteListener)
            document.removeEventListener("resize", resizeTextarea)
        }
    }, [])
    return (
        <div className={classes.messagecontainer}>
            <div className={classes.buttons}>
                <button className={classes.button}>
                    <FaPlusCircle size={20} />
                </button>
            </div>
            <textarea
                className={classes.textarea}
                placeholder={placeholder}
                ref={messageInputRef}
                value={currentMessage}
                style={{
                    height: 20,
                    overflowY: messageInputRef.current?.scrollHeight > 255 ? "scroll" : "hidden"
                }}
                onChange={(event) => {
                    setCurrentMessage(event.target.value)
                    resizeTextarea()
                }}
                onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        if (
                            currentMessage.trim().length > (min ?? 0) &&
                            currentMessage.trim().length < (max ?? 2000)
                        ) {
                            onSubmit(currentMessage)
                            messageInputRef.current.style.height = "2ch"
                            setCurrentMessage("")
                        }
                    }
                }}
            />
            <div className={classes.buttons}>
                <EmojiPopup
                    onSelect={(emoji) => {
                        const [start, end] = [
                            messageInputRef.current.selectionStart,
                            messageInputRef.current.selectionEnd
                        ]
                        messageInputRef.current.setRangeText(
                            `:${emoji.keywords[0]}:`,
                            start,
                            end,
                            "end"
                        )
                        setCurrentMessage(messageInputRef.current.value)
                    }}
                >
                    <EmojiCarousel />
                </EmojiPopup>
                <div
                    className={`${classes.lengthindicator} ${
                        currentMessage.length > (max ?? 2000) ? classes.toolong : ""
                    }`}
                >
                    {currentMessage.length >= (max ?? 2000) - (lengthWarning ?? 200)
                        ? (max ?? 2000) - currentMessage.length
                        : ""}
                </div>
            </div>
        </div>
    )
}

const EmojiCarousel = () => {
    const emojis = [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "🤣",
        "😂",
        "🙂",
        "🙃",
        "😉",
        "😊",
        "😇",
        "🥰",
        "😍",
        "🤩",
        "😘",
        "😗"
    ]
    const [emoji, setEmoji] = useState(0)
    const selectEmoji = () => {
        const e = Math.floor(Math.random() * emojis.length)
        if (e === emoji) console.log("got repeat")
        if (e === emoji) return selectEmoji()
        setEmoji(e)
    }

    return (
        <button className={classes.button} onMouseEnter={selectEmoji}>
            <Twemoji src={emojis[emoji]} />
        </button>
    )
}

export type { MessageInputProps }
export { MessageInputTextarea }
export default MessageInput
