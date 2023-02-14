import DOMPurify from "dompurify"
import emojis from "emoji-dictionary"
import { marked, Renderer } from "marked"
import React, { createElement, useEffect, useState } from "react"
import { defaultRules, parserFor, State } from "simple-markdown-2"
import Twemoji from "./Twemoji"

type MarkdownParagraph = {
    content?: MarkdownText[]
    type?: "paragraph"
}

type MarkdownQuote = {
    content?: MarkdownText[]
    type?: "blockQuote"
}

type MarkdownMention = {
    content?: string[]
    type: "mention"
}

type MarkdownEmoji = {
    content?: string
    type: "emoji"
}

type MarkdownLink = {
    content?: MarkdownText[]
    type?: "link"
    target?: string
}

type MarkdownStyle = {
    content?: MarkdownText[]
    type?: "strong" | "em" | "u" | "del"
}

type MarkdownText = {
    content?: string
    type?: "text"
}

type MarkdownNode =
    | MarkdownText
    | MarkdownStyle
    | MarkdownLink
    | MarkdownEmoji
    | MarkdownMention
    | MarkdownQuote
    | MarkdownParagraph

const mdParse = (markdown: string) => {
    // eslint-disable-next-line no-useless-escape
    const tokenizer = /[^-\\/:-@\[-\`{-~+*_]+[-\\/:-@\[-\`{-~+*_]*?|[-\/:-@\[-\\`{-~+*_]+/g
    const tokens = markdown.match(tokenizer)
    return tokens
}

const emojiRule = {
    order: defaultRules.image.order,
    match(source: string) {
        return /^:(\w+?):/.exec(source)
    },
    parse(capture: RegExpExecArray) {
        return {
            content: capture[1]
        }
    }
}
const mentionRule = {
    order: defaultRules.link.order - 0.5,
    match(source: string) {
        return /^@([\w\s]*)#(\d{4})/.exec(source)
    },
    parse(capture: RegExpExecArray) {
        return {
            content: [capture[1], capture[2]]
        }
    }
}
const quoteRule = {
    order: 0,
    match(source: string) {
        const regex = /^>[^\S\r\n]([^\n\r]{1,})/
        const exec = regex.exec(source)
        // console.log({ source, regex, exec })
        return exec
    },
    parse(
        capture: RegExpExecArray,
        parse: (text: string, state: State) => MarkdownText[],
        state: State
    ) {
        return {
            content: parse(capture[1], state)
        }
    }
}
const rules = Object.assign({ ...defaultRules }, { emoji: emojiRule, mention: mentionRule })
console.log(rules.Array)
const parser = parserFor(rules)
const parseMarkdown = (source: string) => {
    return parser(source, {
        inline: false
    })
}

const useMarkdown = (content: string) => {
    const [html, setHtml] = useState("")
    const renderer = new Renderer()
    const sanitize = (text: string) =>
        DOMPurify.sanitize(text, {
            ALLOWED_TAGS: ["strong", "em", "del", "a"]
        })
    // renderer.html = sanitize
    // renderer.text = sanitize
    marked.use({ renderer })
    useEffect(() => {
        setHtml(sanitize(marked.parseInline(content)))
    }, [content])
    return html
}

type MarkdownProps = {
    text: string
}

type RenderMarkdownNodeProps = {
    node: MarkdownNode | MarkdownNode[]
}

const RenderMarkdownNode = ({ node }: RenderMarkdownNodeProps) => {
    if (node instanceof Array) {
        return (
            <>
                {node.map((node, index) => (
                    <RenderMarkdownNode key={index} node={node} />
                ))}
            </>
        )
    } else if (node.type === "paragraph") {
        return (
            <p>
                <RenderMarkdownNode node={node.content} />
            </p>
        )
    } else if (node.type === "blockQuote") {
        return (
            <blockquote>
                <RenderMarkdownNode node={node.content} />
            </blockquote>
        )
    } else if (node.type === "text") {
        const lines = node.content.split("\n")
        return (
            <>
                {lines.map((text, index) => (
                    <span key={index}>
                        {text}
                        {text && index < lines.length - 1 && <br />}
                    </span>
                ))}
            </>
        )
    } else if (node.type === "link") {
        return (
            <a href={node.target}>
                <RenderMarkdownNode node={node.content} />
            </a>
        )
    } else if (node.type === "emoji") {
        return <Twemoji src={node.content} tooltip />
    } else if (node.type === "mention") {
        return (
            <span
                style={{
                    color: "blue"
                }}
            >
                {node.content[0]}#{node.content[1]}
            </span>
        )
    } else {
        return createElement(node.type, null, <RenderMarkdownNode node={node.content} />)
    }
}

const Markdown = ({ text }: MarkdownProps) => {
    text = text || " "
    text = text
        .replace(
            // applies proper formatting to emojis
            /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gm,
            (match) => `:${emojis.getName(match)}:` || match
        )
        .replace(/^.{0}$/gm, " ")
    const md: MarkdownNode[] = parseMarkdown(text) as unknown as MarkdownNode[]
    return (
        <>
            {/* <pre
                style={{
                    fontFamily: "monospace"
                }}
            >
                {JSON.stringify(md, null, 2)}
            </pre> */}
            <RenderMarkdownNode node={md} />
        </>
    )
    const parsed = mdParse(text)
    return (
        <pre
            style={{
                fontFamily: "monospace"
            }}
        >
            {JSON.stringify(parsed, null, 2)}
        </pre>
    )
}

export type {
    MarkdownProps,
    MarkdownParagraph,
    MarkdownQuote,
    MarkdownEmoji,
    MarkdownLink,
    MarkdownStyle,
    MarkdownText,
    MarkdownNode
}
export { useMarkdown, parseMarkdown }
export default Markdown
