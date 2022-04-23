import { sanitize } from "dompurify"
import { marked, Renderer } from "marked"
import { useEffect, useState } from "react"

const useMarkdown = (content: string) => {
    const [html, setHtml] = useState("")
    const renderer = new Renderer()
    renderer.heading = (text) => text
    marked.use({
        renderer: renderer
    })
    useEffect(() => {
        setHtml(sanitize(marked.parseInline(content)))
    })
    return html
}

export { useMarkdown }
