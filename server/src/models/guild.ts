import { model, Schema } from "mongoose"
import { Guild } from "../globals"

const GuildSchema = new Schema<Guild>(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        owner: { type: String, required: true },
        members: { type: [String], required: true },
        invites: { type: [String], required: true },
        channels: { type: [String], required: true }
    },
    {
        collection: "guilds"
    }
)

const GuildModel = model("Guild", GuildSchema)

export { GuildModel }
