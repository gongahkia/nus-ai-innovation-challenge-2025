/* eslint-disable */

"use client"

import { useEffect, useState } from "react"
import { useFirebase } from "@/lib/firebase/firebase-provider"
import { ref, onValue, off, get, set } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"

// Define types for analytics data
type AnalyticsStats = {
  totalTransactions: number
  totalRevenue: number
  averageOrderValue: number
  topProduct: {
    name: string
    count: number
  }
}

export default function AnalyticsPage() {
  const { database, userId } = useFirebase()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AnalyticsStats>({
    totalTransactions: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topProduct: {
      name: "None",
      count: 0,
    },
  })

  useEffect(() => {
    if (!userId || !database) return

    setLoading(true)

    // Reference to the analytics data in Firebase
    const analyticsRef = ref(database, `users/${userId}/analytics`)

    // Listen for changes to the analytics data
    const handleData = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val()

        // Handle images
        if (data.images) {
          // If images is an array, use it directly
          if (Array.isArray(data.images)) {
            setImageUrls(data.images)
          }
          // If images is an object with keys, extract the values
          else if (typeof data.images === "object") {
            setImageUrls(Object.values(data.images))
          }
          // If images is a single string, put it in an array
          else if (typeof data.images === "string") {
            setImageUrls([data.images])
          }
        } else {
          setImageUrls([])
        }

        // Handle stats
        if (data.stats) {
          setStats({
            totalTransactions: data.stats.totalTransactions || 0,
            totalRevenue: data.stats.totalRevenue || 0,
            averageOrderValue: data.stats.averageOrderValue || 0,
            topProduct: data.stats.topProduct || { name: "None", count: 0 },
          })
        }
      } else {
        setImageUrls([])
      }

      setLastUpdated(new Date())
      setLoading(false)
    }

    const handleError = (error: any) => {
      console.error("Error fetching analytics data:", error)
      setLoading(false)
    }

    onValue(analyticsRef, handleData, handleError)

    // If no stats exist yet, calculate them from sales data
    const calculateStats = async () => {
      try {
        const salesRef = ref(database, `users/${userId}/sales`)
        const salesSnapshot = await get(salesRef)

        if (salesSnapshot.exists()) {
          const salesData = salesSnapshot.val()
          const sales = Object.values(salesData) as any[]

          // Calculate stats
          const totalTransactions = sales.length
          const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0)
          const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

          // Find top product
          const productCounts: Record<string, { name: string; count: number }> = {}

          sales.forEach((sale) => {
            if (sale.items && Array.isArray(sale.items)) {
              sale.items.forEach((item: any) => {
                if (!productCounts[item.itemId]) {
                  productCounts[item.itemId] = { name: item.name, count: 0 }
                }
                productCounts[item.itemId].count += item.quantity || 1
              })
            }
          })

          let topProduct = { name: "None", count: 0 }

          Object.values(productCounts).forEach((product) => {
            if (product.count > topProduct.count) {
              topProduct = product
            }
          })

          // Save calculated stats to Firebase
          const statsRef = ref(database, `users/${userId}/analytics/stats`)
          await set(statsRef, {
            totalTransactions,
            totalRevenue,
            averageOrderValue,
            topProduct,
          })
        }
      } catch (error) {
        console.error("Error calculating stats:", error)
      }
    }

    // Calculate stats if they don't exist
    const checkAndCalculateStats = async () => {
      const statsRef = ref(database, `users/${userId}/analytics/stats`)
      const statsSnapshot = await get(statsRef)

      if (!statsSnapshot.exists()) {
        await calculateStats()
      }
    }

    checkAndCalculateStats()

    // Clean up listener when component unmounts
    return () => {
      off(analyticsRef)
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
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="neobrutalist-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">{stats.totalTransactions}</div>
                <p className="text-muted-foreground">transactions</p>
              </CardContent>
            </Card>

            <Card className="neobrutalist-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">${stats.totalRevenue.toFixed(2)}</div>
                <p className="text-muted-foreground">revenue</p>
              </CardContent>
            </Card>

            <Card className="neobrutalist-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Average Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">${stats.averageOrderValue.toFixed(2)}</div>
                <p className="text-muted-foreground">per transaction</p>
              </CardContent>
            </Card>

            <Card className="neobrutalist-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Top Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black truncate">{stats.topProduct.name}</div>
                <p className="text-muted-foreground">{stats.topProduct.count} units sold</p>
              </CardContent>
            </Card>
          </div>

          {/* Images Section */}
          {imageUrls.length === 0 ? (
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
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error("Image failed to load:", imageUrls[0])
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
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error("Image failed to load:", url)
                      e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                      e.currentTarget.alt = "Failed to load image"
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}