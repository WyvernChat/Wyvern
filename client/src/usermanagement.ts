import axios from "axios"
import { User } from "./globals"

async function getUserData(token: string | undefined) {
    const user = await getUser(token)
    if (user) {
        user.guilds = await getGuilds(token)
    }
    return user
}

async function getUser(token: string | undefined): Promise<User | undefined> {
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

async function getGuilds(token: string | undefined): Promise<string[] | undefined> {
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
