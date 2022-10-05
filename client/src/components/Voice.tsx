import { Peer } from "peerjs"
import React, { useCallback, useEffect, useRef, useState } from "react"

export function Voice() {
    const peer = useRef(new Peer())
    const stream = useRef<MediaStream>()
    const [target, setTarget] = useState("")
    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                video: false,
                audio: true
            })
            .then((s) => (stream.current = s))
    }, [])
    const startCall = useCallback(() => {
        // peer.current.
    }, [])
    return (
        <div>
            <input value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
    )
}
