import fs from "fs"
import { Guild, User } from "./globals"

class Database<Type> {
    public data: Type
    private databasePath: string

    constructor(databasePath: string, database?: Type) {
        this.databasePath = databasePath
        if (fs.existsSync(databasePath)) {
            this.data = JSON.parse(fs.readFileSync(databasePath).toString())
        } else {
            this.data = database
        }
        setInterval(() => {
            fs.writeFileSync(databasePath, JSON.stringify(this.data, null, 2))
        }, 6000)
    }

    reload() {
        if (fs.existsSync(this.databasePath)) {
            this.data = JSON.parse(fs.readFileSync(this.databasePath).toString())
        }
    }
}

interface WyvernDatabase {
    users: User[]
    guilds: Guild[]
}

export { Database, WyvernDatabase }
