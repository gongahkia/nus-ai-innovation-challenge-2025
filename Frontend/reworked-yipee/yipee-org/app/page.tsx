"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFirebase } from "@/lib/firebase/firebase-provider"

export default function Home() {
  const { user, loading } = useFirebase()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/auth/login")
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="neobrutalist-card p-8">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        <div className="w-16 h-16 border-8 border-t-accent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}