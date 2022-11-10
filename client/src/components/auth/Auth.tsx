import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from "react"
import { useGlobalState } from "../../App"

interface Authentication {
    authenticated: boolean
    setAuthenticated: Dispatch<SetStateAction<boolean>>
    loading: boolean
    setLoading: Dispatch<SetStateAction<boolean>>
    login(token: string | undefined): Promise<void>
    logout(): Promise<void>
}

const authenticationContext = createContext<Authentication>(undefined)

function AuthProvider(props: { children: ReactNode }) {
    const [authenticated, setAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [, setToken] = useGlobalState("token")
    return (
        <authenticationContext.Provider
            value={{
                authenticated,
                setAuthenticated,
                loading,
                setLoading,
                login(token: string | undefined) {
                    return new Promise<void>((resolve) => {
                        if (!token) {
                            setLoading(false)
                            resolve()
                        } else {
                            setToken(token)
                            setAuthenticated(true)
                            setLoading(false)
                            resolve()
                        }
                    })
                },
                logout() {
                    return new Promise<void>((resolve) => {
                        setToken(undefined)
                        setAuthenticated(false)
                        setLoading(false)
                        resolve()
                    })
                }
            }}
        >
            {props.children}
        </authenticationContext.Provider>
    )
}

function useAuth() {
    return useContext(authenticationContext)
}

export { AuthProvider, useAuth }
