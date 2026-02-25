"use client"

import { useEffect } from "react"

export default function HeaderHeightSync() {
  useEffect(() => {
    const header = document.querySelector("header")
    if (!header) return

    const sync = () =>
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight}px`
      )

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  return null
}
