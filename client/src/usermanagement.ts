import axios from "axios"
import { User } from "./globals"

async function getUserData() {
    const user = await getUser()
    if (user) {
        user.guilds = await getGuilds()
    }
    return user
}

async function getUser(): Promise<User | undefined> {
    const token = localStorage.getItem("token")
    if (token) {
        const response = await axios.get(`/api/user`, {
            headers: {
                authorization: token
            }
        })
        if (response.status === 200) {
            return response.data.user
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

async function getCachedUser(id: string, userCache: User[]) {
    let user: User
    if (userCache.find((u) => u.id === id)) {
        user = userCache.find((u) => u.id === id)
    } else {
        const response = await axios.get(`/api/user/${id}/data`)
        if (response.status === 200) {
            user = response.data.user
            userCache.push(response.data.user)
        }
    }
    return {
        cachedUser: user,
        newCache: userCache
    }
}

async function getGuilds(): Promise<string[] | undefined> {
    const token = localStorage.getItem("token")
    if (token) {
        const response = await axios.get(`/api/user/guilds`, {
            headers: {
                authorization: token
            }
        })
        if (response.status === 200) {
            return response.data.guilds
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

export { getUserData, getUser, getCachedUser, getGuilds }
