import { useEffect, useState } from "react"

const breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
}

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

const getCurrentBreakpoint = () => {
    let current: Breakpoint = "xs"
    Object.keys(breakpoints).map((bp: Breakpoint) => {
        const size = breakpoints[bp]
        if (size >= window.screen.width) current = bp
    })
    return current
}

const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs")

    useEffect(() => {
        setBreakpoint(getCurrentBreakpoint())
        const onResize = () => setBreakpoint(getCurrentBreakpoint())
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    return breakpoint
}

const useResponsive = (minBreakpoint: Breakpoint) =>
    window.screen.width >= breakpoints[minBreakpoint]

export { breakpoints, useBreakpoint }
export type { Breakpoint }
export default useResponsive
