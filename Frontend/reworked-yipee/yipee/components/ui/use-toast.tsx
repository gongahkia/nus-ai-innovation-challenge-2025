"use client"

import { useState, useEffect } from "react"

interface ToastProps {
  title: string
  description: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, props])
  }

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1))
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [toasts])

  return {
    toast,
    Toaster: () => (
      <div className="fixed bottom-4 right-4 z-50">
        {toasts.map((t, i) => (
          <div
            key={i}
            className={`mb-2 p-4 rounded-md shadow-md ${
              t.variant === "destructive" ? "bg-red-500 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h3 className="font-bold">{t.title}</h3>
            <p>{t.description}</p>
          </div>
        ))}
      </div>
    ),
  }
}

export type { ToastProps }