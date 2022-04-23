import { Database, WyvernDatabase } from "./database"
import { TextChannel } from "./globals"

function getTextChannel(database: Database<WyvernDatabase>, guild: string, channel: string) {
    return database.data.guilds
        .find((g) => g.id === guild)
        ?.channels.find((c) => c.id === channel) as TextChannel
}

export { getTextChannel }
