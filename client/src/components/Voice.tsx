import React, { Component } from "react"
import { Button } from "react-bootstrap"
import { FaMicrophone } from "react-icons/fa"

export class Voice extends Component<{}, {}> {
    constructor(propss: {}) {
        super(propss)
    }

    render() {
        return (
            <div>
                <Button onClick={this.microphone}>
                    <FaMicrophone />
                </Button>
            </div>
        )
    }

    async microphone() {
        let stream: MediaStream | null = null
        let audioCtx = new AudioContext({})
        let audioPlayer = new AudioContext({})
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
            const source = audioCtx.createMediaStreamSource(stream)
            const processor = audioCtx.createScriptProcessor(2048, 1, 1)

            source.connect(processor)
            processor.connect(audioCtx.destination)

            // processor.onaudioprocess = (event) => {
            //     socket.emit("voice packet", event.inputBuffer.getChannelData(0))
            // }

            // socket.on("voice packet", (data: ArrayBuffer) => {
            //     console.log(data)
            //     const buffer = audioPlayer.createBuffer(1, 2048, audioPlayer.sampleRate)

            //     // buffer.getChannelData(0).set(await audioPlayer.decodeAudioData(data))

            //     const node = new AudioBufferSourceNode(audioPlayer, { buffer: buffer })

            //     node.connect(audioPlayer.destination)
            //     node.start(0)
            // })

            audioPlayer.resume()
        } catch (err) {
            console.log(err)
        }
    }
}
