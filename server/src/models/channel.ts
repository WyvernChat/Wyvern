import { model, Schema } from "mongoose"
import { Message, TextChannel } from "../globals"

const MessageSchema = new Schema<Message>({
    id: { type: String, required: true },
    content: { type: String, required: true },
    sent: { type: Number, required: true },
    author: { type: String, required: true },
    channel: { type: String, required: true }
})

const TextChannelSchema = new Schema<TextChannel>(
    {
        id: { type: String, required: true },
        guild: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: false },
        slowmode: { type: Number, required: false },
        messages: { type: [MessageSchema], required: false }
    },
    {
        collection: "textChannels"
    }
)

const TextChannelModel = model("TextChannel", TextChannelSchema)

export { TextChannelModel }
