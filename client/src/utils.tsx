import React, {
    Dispatch,
    ReactNode,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react"

type ReactState<T> = [T, Dispatch<T>]

const useMounted = () => {
    const mounted = useRef(false)
    const mountedFn = useCallback(() => mounted.current, [])

    useEffect(() => {
        return () => {
            mounted.current = true
        }
    })

    return mountedFn
}

const useForceUpdate = () => {
    const [, setState] = useState(0)
    const forceUpdate = useCallback(() => setState(Date.now()), [])
    return forceUpdate
}

const useHidden = () => {
    const hidden = useRef(false)
    if (document.hidden !== undefined) {
        document.addEventListener("visibilitychange", (event) => {
            hidden.current = document.hidden
        })
    }
    return hidden
}

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min

const BoundingRect = (props: { children: (size: [number, number]) => ReactNode }) => {
    const ref = useRef<HTMLDivElement>(undefined)
    const [size, setSize] = useState<[number, number]>([0, 0])
    const resizeObserver = new ResizeObserver(() => {
        if (ref.current) {
            setSize([
                ref.current.getBoundingClientRect().width,
                ref.current.getBoundingClientRect().height
            ])
        }
    })

    useEffect(() => {
        resizeObserver.observe(ref?.current as Element)
    }, [])
    return <div ref={ref}>{props.children(size)}</div>
}

function useLocalStorage<T>(key: string, initialValue: T): ReactState<T> {
    const [state, setState] = useState<T>(JSON.parse(localStorage.getItem(key)) || initialValue)

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state))
    }, [key, state])

    return [state, setState]
}

const useOnce = (): [boolean, () => void] => {
    const [state, setState] = useState(false)

    const triggerState = useCallback(() => {
        if (!state) setState(true)
    }, [state])

    return [state, triggerState]
}

// source: @Klerith https://gist.github.com/Klerith/80abd742d726dd587f4bd5d6a0ab26b6
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

const useTitle = (title: string) => {
    document.title = title
}

const useDebounce = <T,>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => clearTimeout(handler)
    }, [value, delay])

    return debouncedValue
}

const useDisableScroll = (element: RefObject<HTMLElement>, disable: boolean) => {
    const preventDefault = (e: Event) => {
        e.preventDefault()
        console.log("Stopped", e)
    }
    const addEvents = useCallback(() => {
        element.current.addEventListener("wheel", preventDefault, {
            passive: false
        })
        element.current.addEventListener("touchmove", preventDefault, {
            passive: false
        })
    }, [element])
    const removeEvents = useCallback(() => {
        element.current.removeEventListener("wheel", preventDefault)
        element.current.removeEventListener("touchmove", preventDefault)
    }, [element])
    useEffect(() => {
        if (disable) addEvents()
        else removeEvents()
    }, [addEvents, disable, removeEvents])
}

export type { ReactState }
export {
    useMounted,
    useForceUpdate,
    useHidden,
    randomRange,
    BoundingRect,
    useLocalStorage,
    useOnce,
    urlBase64ToUint8Array,
    useTitle,
    useDebounce,
    useDisableScroll
}
