import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react"
import { randomRange } from "../utils"

interface AlertConfig {
    type: "primary" | "success" | "warning" | "danger"
    text: string
    id?: number
}

const AlertContext = createContext<[AlertConfig[], Dispatch<SetStateAction<AlertConfig[]>>]>(null)

function AlertProvider(props: { children: ReactNode }) {
    const [alerts, setAlerts] = useState<AlertConfig[]>([])
    useEffect(() => {
        // console.log(alerts)
    }, [alerts])
    return (
        <AlertContext.Provider value={[alerts, setAlerts]}>
            <AlertList />
            {props.children}
        </AlertContext.Provider>
    )
}

function AlertList() {
    const [alerts, setAlerts] = useContext(AlertContext)
    return (
        <div className="AlertProvider">
            <div className="Alerts">
                {alerts.map((alert) => (
                    // <Alert
                    //     key={index}
                    //     variant={alert.type}
                    //     dismissible
                    //     onClose={() => {
                    //         setAlerts(alerts.filter((a) => a.id !== alert.id))
                    //     }}
                    // >
                    //     {alert.text}
                    // </Alert>
                    <div key={alert.id}></div>
                ))}
            </div>
        </div>
    )
}

const useAlert = () => {
    const alertRef = useRef<[AlertConfig[], Dispatch<SetStateAction<AlertConfig[]>>]>(null)
    alertRef.current = useContext(AlertContext)
    const alertFunction = useCallback((alert: AlertConfig) => {
        const [, setAlerts] = alertRef.current
        alert.id = randomRange(10000, 99999)
        setAlerts((prevAlerts) => [...prevAlerts, alert])
    }, [])
    return alertFunction
}

export { AlertProvider, useAlert }
