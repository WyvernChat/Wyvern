import { model, Schema } from "mongoose"
import { User } from "../globals"

const UserSchema = new Schema<User>(
    {
        id: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        username: { type: String, required: true },
        tag: { type: Number, required: true },
        token: { type: String, required: true },
        guilds: { type: [String], required: true }
    },
    {
        collection: "users"
    }
)

const UserModel = model("User", UserSchema)

export { UserModel }
