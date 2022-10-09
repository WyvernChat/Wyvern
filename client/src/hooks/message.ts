import axios from "axios"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useGlobalState } from "../App"
import { useSocketListener } from "../components/SocketIO"
import { Message } from "../globals"

type MessagesHookEvents = {
    onMessageCreate?: (message: Message) => void
    onMessageUpdate?: (message: Message) => void
    onMessageDelete?: (messageId: string) => void
}

const useMessages = (
    channelId: string,
    { onMessageCreate, onMessageUpdate, onMessageDelete }: MessagesHookEvents
): [Message[], Dispatch<SetStateAction<Message[]>>] => {
    const [token] = useGlobalState("token")
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        if (channelId) {
            axios
                .get(`/api/channels/${channelId}/messages`, {
                    headers: {
                        authorization: token
                    }
                })
                .then((res) => res.data)
                .then(setMessages)
        }
    }, [channelId, token])

    useSocketListener("MESSAGE_CREATE", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message])
        onMessageCreate && onMessageCreate(message)
    })

    useSocketListener("MESSAGE_UPDATE", (message: Message) => {
        setMessages(messages.map((m) => (m.id === message.id ? { ...message } : { ...m })))
        onMessageUpdate && onMessageUpdate(message)
    })

    useSocketListener("MESSAGE_DELETE", (messageId: string) => {
        setMessages(messages.filter((m) => m.id !== messageId))
        onMessageDelete && onMessageDelete(messageId)
    })

    return [messages, setMessages]
}

export { useMessages }
