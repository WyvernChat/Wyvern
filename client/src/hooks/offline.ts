import { useEffect, useState } from "react"

const useOffline = () => {
    const [offline, setOffline] = useState(!navigator.onLine)
    useEffect(() => {
        window.addEventListener("offline", () => setOffline(true))
        window.addEventListener("online", () => setOffline(false))
        return () => {
            window.removeEventListener("offline", () => setOffline(true))
            window.removeEventListener("online", () => setOffline(false))
        }
    }, [])
    return offline
}

export { useOffline }
