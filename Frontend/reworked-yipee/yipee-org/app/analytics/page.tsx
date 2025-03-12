/* eslint-disable */

"use client"

import { useEffect, useState } from "react"
import { useFirebase } from "@/lib/firebase/firebase-provider"
import { ref, onValue, off } from "firebase/database"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

export default function AnalyticsPage() {
  const { database, userId } = useFirebase()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !database) return

    setLoading(true)

    // Reference to the analytics images in Firebase
    const imagesRef = ref(database, `users/${userId}/analytics/images`)

    // Listen for changes to the images
    const handleData = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val()

        // If data is an array, use it directly
        if (Array.isArray(data)) {
          setImageUrls(data)
        }
        // If data is an object with keys, extract the values
        else if (typeof data === "object") {
          setImageUrls(Object.values(data))
        }
        // If data is a single string, put it in an array
        else if (typeof data === "string") {
          setImageUrls([data])
        }
        // Otherwise, set empty array
        else {
          setImageUrls([])
        }
      } else {
        setImageUrls([])
      }

      setLastUpdated(new Date())
      setLoading(false)
    }

    const handleError = (error: any) => {
      console.error("Error fetching analytics images:", error)
      setLoading(false)
    }

    onValue(imagesRef, handleData, handleError)

    // Clean up listener when component unmounts
    return () => {
      off(imagesRef)
    }
  }, [database, userId])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-black">Analytics</h1>
        {lastUpdated && (
          <p className="text-muted-foreground text-right">
            Last updated: {format(lastUpdated, "MMM d, yyyy h:mm:ss a")}
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="neobrutalist-card p-8">
            <h2 className="text-2xl font-bold mb-4">Loading analytics data...</h2>
            <div className="w-16 h-16 border-8 border-t-accent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : imageUrls.length === 0 ? (
        <Card className="neobrutalist-card p-8 text-center">
          <p className="text-xl font-bold">No analytics images available</p>
        </Card>
      ) : imageUrls.length === 1 ? (
        // Single image - centered
        <div className="flex justify-center">
          <div className="neobrutalist-card p-4 max-w-3xl">
            <img
              src={imageUrls[0] || "/placeholder.svg"}
              alt="Analytics visualization"
              className="w-full h-auto"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                e.currentTarget.alt = "Failed to load image"
              }}
            />
          </div>
        </div>
      ) : (
        // Multiple images - 2 column grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {imageUrls.map((url, index) => (
            <div key={index} className="neobrutalist-card p-4">
              <img
                src={url || "/placeholder.svg"}
                alt={`Analytics visualization ${index + 1}`}
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                  e.currentTarget.alt = "Failed to load image"
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}