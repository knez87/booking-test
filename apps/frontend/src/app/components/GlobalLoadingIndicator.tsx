"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

export function GlobalLoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [location])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 bg-blue-600 animate-pulse">
        <div className="h-full bg-blue-600 animate-progress"></div>
      </div>
    </div>
  )
}
