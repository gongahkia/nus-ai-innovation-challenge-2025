"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useFirebase } from "@/lib/firebase/firebase-provider"
import { useFirestore } from "@/lib/firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"
import { Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"

export default function DashboardPage() {
  const { user } = useFirebase()
  const { getInventoryItems, getSales, getTopSellingItems } = useFirestore()
  const [inventoryCount, setInventoryCount] = useState(0)
  const [salesCount, setSalesCount] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get inventory count
        const inventory = await getInventoryItems()
        setInventoryCount(inventory.length)

        // Get sales data
        const sales = await getSales()
        setSalesCount(sales.length)

        // Calculate total revenue
        const revenue = sales.reduce((total, sale) => total + sale.total, 0)
        setTotalRevenue(revenue)

        // Get top selling products
        const topItems = await getTopSellingItems(5)
        setTopProducts(topItems)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [getInventoryItems, getSales, getTopSellingItems])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="neobrutalist-card p-8">
          <h2 className="text-2xl font-bold mb-4">Loading dashboard data...</h2>
          <div className="w-16 h-16 border-8 border-t-accent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black">Dashboard</h1>
        <p className="text-lg">Welcome back, {user?.email}</p>
      </div>

      {/* Quick action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/pos">
          <Button className="neobrutalist-button w-full h-20 bg-primary text-white text-lg flex items-center justify-center gap-2">
            <ShoppingCart size={24} />
            New Sale
          </Button>
        </Link>
        <Link href="/inventory">
          <Button className="neobrutalist-button w-full h-20 bg-secondary text-black text-lg flex items-center justify-center gap-2">
            <Package size={24} />
            Manage Inventory
          </Button>
        </Link>
        <Link href="/sales">
          <Button className="neobrutalist-button w-full h-20 bg-accent text-white text-lg flex items-center justify-center gap-2">
            <DollarSign size={24} />
            View Sales
          </Button>
        </Link>
        <Link href="/analytics">
          <Button className="neobrutalist-button w-full h-20 bg-white text-black text-lg flex items-center justify-center gap-2">
            <TrendingUp size={24} />
            Analytics
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="neobrutalist-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Total Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{inventoryCount}</div>
            <p className="text-muted-foreground">items in stock</p>
          </CardContent>
        </Card>
        <Card className="neobrutalist-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{salesCount}</div>
            <p className="text-muted-foreground">transactions</p>
          </CardContent>
        </Card>
        <Card className="neobrutalist-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">${totalRevenue.toFixed(2)}</div>
            <p className="text-muted-foreground">all time</p>
          </CardContent>
        </Card>
      </div>

      {/* Top selling products chart */}
      <Card className="neobrutalist-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "4px solid black",
                      borderRadius: "0px",
                      padding: "10px",
                    }}
                  />
                  <Bar dataKey="count" fill="#8884d8" name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-xl font-bold">No sales data available yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}