import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react"

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

function useLocalStorage<T>(key: string, initialValue: T) {
    const state = useState<T>(JSON.parse(localStorage.getItem(key)) || initialValue)

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state[0]))
    }, [state[0]])

    return state
}

const useOnce = (): [boolean, () => void] => {
    const [state, setState] = useState(false)

    const triggerState = useCallback(() => {
        if (!state) setState(true)
    }, [state])

    return [state, triggerState]
}

export {
    useMounted,
    useForceUpdate,
    useHidden,
    randomRange,
    BoundingRect,
    useLocalStorage,
    useOnce
}
