import React, { useEffect, useRef } from "react"

export function Voice() {
    const stream = useRef<MediaStream>()
    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                video: false,
                audio: true
            })
            .then((s) => (stream.current = s))
    }, [])
    return <div></div>
}
