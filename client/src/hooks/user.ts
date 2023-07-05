import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import { useGlobalState } from "../App"
import { User } from "../globals"

const fetcher = (url: string) => axios.get(url)

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
    const requestBlock = useRef<{ [id: string]: boolean }>({})

    const cachedUser = useCallback(
        async (id: string) => {
            let user = users.find((u) => u.id === id)
            if (user) return user
            if (requestBlock.current[id]) return false
            requestBlock.current[id] = true
            const response = await axios.get(`/api/user/${id}`)
            if (response.status === 200) {
                user = response.data.user
                setUsers([...users, user])
                requestBlock.current[id] = false
            }
            return user
        },
        [users, setUsers]
    )
    return [cachedUser]
}

const useCachedUser = (id: string) => {
    const [cachedUser] = useUserCache()
    const [user, setUser] = useState<User>(undefined)
    // const { data } = useSWR(`/api/user/${id}`, fetcher)

    useEffect(() => {
        if (id) cachedUser(id).then((user) => user && setUser(user))
    }, [id, cachedUser])

    return user
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

export { getUser, useUserCache, useCachedUser, getCachedUser }
