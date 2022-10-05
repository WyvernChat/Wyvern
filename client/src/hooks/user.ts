import axios from "axios"
import { useCallback } from "react"
import { useGlobalState } from "../App"
import { User } from "../globals"

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

const useUserCache = () => {
    const [users, setUsers] = useGlobalState("users")
    const cachedUser = useCallback(
        async (id: string) => {
            let user = users.find((u) => u.id === id)
            if (user) return user
            const response = await axios.get(`/api/user/${id}`)
            if (response.status === 200) {
                user = response.data.user
                setUsers([...users, user])
            }
            return user
        },
        [users]
    )
    return [cachedUser]
}

async function getCachedUser(id: string, userCache: User[]) {
    let user: User
    if (userCache.find((u) => u.id === id)) {
        user = userCache.find((u) => u.id === id)
    } else {
        const response = await axios.get(`/api/user/${id}`)
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

export { getUser, useUserCache, getCachedUser }
