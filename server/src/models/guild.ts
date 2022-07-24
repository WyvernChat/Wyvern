import { model, Schema } from "mongoose"
import { Guild, Message, TextChannel } from "../globals"

const MessageSchema = new Schema<Message>({
    id: { type: String, required: true },
    content: { type: String, required: true },
    sent: { type: Number, required: true },
    author: { type: String, required: true }
})

const TextChannelSchema = new Schema<TextChannel>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    type: { type: String, required: false, enum: ["TEXT", "VOICE"] },
    slowmode: { type: Number, required: false },
    messages: { type: [MessageSchema], required: false }
})
const VoiceChannelSchema = new Schema<TextChannel>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    type: { type: String, required: false, enum: ["TEXT", "VOICE"] },
    slowmode: { type: Number, required: false },
    messages: { type: [MessageSchema], required: false }
})

const GuildSchema = new Schema<Guild>(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        owner: { type: String, required: true },
        members: { type: [String], required: true },
        invites: { type: [String], required: true },
        channels: { type: [TextChannelSchema], required: true }
    },
    {
        collection: "guilds"
    }
)

const GuildModel = model("Guild", GuildSchema)

export { GuildModel }
