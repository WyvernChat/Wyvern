import DOMPurify from "dompurify"
import { marked, Renderer } from "marked"
import { useEffect, useState } from "react"

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

export { useMarkdown }
