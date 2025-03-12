/* eslint-disable */

"use client"

import { useEffect, useState } from "react"
import { useRealtimeDatabase, type Sale } from "@/lib/firebase/realtime-database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "@/components/ui/chart"
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

// Chart colors
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F", "#FFBB28", "#FF8042"]

export default function AnalyticsPage() {
  const { getTopSellingItems, useSalesRealtime } = useRealtimeDatabase()
  const { sales: allSales, loading: salesLoading } = useSalesRealtime()

  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState<Sale[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [dateRange, setDateRange] = useState("week")

  useEffect(() => {
    if (salesLoading) return

    fetchAnalyticsData()
  }, [dateRange, salesLoading, allSales])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)

      // Set date range based on selection
      let startDate, endDate
      const now = new Date()

      switch (dateRange) {
        case "day":
          startDate = startOfDay(now)
          endDate = endOfDay(now)
          break
        case "week":
          startDate = startOfWeek(now)
          endDate = endOfWeek(now)
          break
        case "month":
          startDate = startOfMonth(now)
          endDate = endOfMonth(now)
          break
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1)
          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
          break
        default:
          startDate = subDays(now, 7)
          endDate = now
      }

      // Filter sales data for the selected period
      // For simplicity, we'll filter the already loaded sales data client-side
      // In a production app, you might want to use the getSalesByDateRange function
      // which would be more efficient for large datasets
      const filteredSales = allSales.filter((sale) => {
        if (!sale.createdAt) return false

        const saleDate = typeof sale.createdAt === "number" ? new Date(sale.createdAt) : new Date(sale.createdAt)

        return saleDate >= startDate && saleDate <= endDate
      })

      setSalesData(filteredSales)

      // Fetch top selling products
      const topItems = await getTopSellingItems(5)
      setTopProducts(topItems)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      setLoading(false)
    }
  }

  // Prepare data for sales by day chart
  const prepareSalesByDayData = () => {
    const salesByDay: Record<string, { date: string; total: number; count: number }> = {}

    salesData.forEach((sale) => {
      if (!sale.createdAt) return

      // Handle different timestamp formats
      const saleDate = typeof sale.createdAt === "number" ? new Date(sale.createdAt) : new Date(sale.createdAt)

      const date = format(saleDate, "MMM dd")

      if (!salesByDay[date]) {
        salesByDay[date] = {
          date,
          total: 0,
          count: 0,
        }
      }

      salesByDay[date].total += sale.total
      salesByDay[date].count += 1
    })

    return Object.values(salesByDay)
  }

  // Prepare data for payment methods chart
  const preparePaymentMethodsData = () => {
    const paymentMethods: Record<string, number> = {}

    salesData.forEach((sale) => {
      const method = sale.paymentMethod || "unknown"

      if (!paymentMethods[method]) {
        paymentMethods[method] = 0
      }

      paymentMethods[method] += 1
    })

    return Object.entries(paymentMethods).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
  }

  // Calculate total revenue
  const calculateTotalRevenue = () => {
    return salesData.reduce((total, sale) => total + sale.total, 0)
  }

  // Calculate average order value
  const calculateAverageOrderValue = () => {
    if (salesData.length === 0) return 0
    return calculateTotalRevenue() / salesData.length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-black">Analytics</h1>
        <Tabs value={dateRange} onValueChange={setDateRange} className="w-full md:w-auto">
          <TabsList className="neobrutalist-card p-1 bg-white">
            <TabsTrigger value="day" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Day
            </TabsTrigger>
            <TabsTrigger value="week" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Month
            </TabsTrigger>
            <TabsTrigger value="year" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Year
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading || salesLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="neobrutalist-card p-8">
            <h2 className="text-2xl font-bold mb-4">Loading analytics data...</h2>
            <div className="w-16 h-16 border-8 border-t-accent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="neobrutalist-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">{salesData.length}</div>
                <p className="text-muted-foreground">transactions</p>
              </CardContent>
            </Card>
            <Card className="neobrutalist-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">${calculateTotalRevenue().toFixed(2)}</div>
                <p className="text-muted-foreground">for selected period</p>
              </CardContent>
            </Card>
            <Card className="neobrutalist-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Avg. Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">${calculateAverageOrderValue().toFixed(2)}</div>
                <p className="text-muted-foreground">per transaction</p>
              </CardContent>
            </Card>
            <Card className="neobrutalist-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Top Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black truncate">
                  {topProducts.length > 0 ? topProducts[0].name : "No data"}
                </div>
                <p className="text-muted-foreground">
                  {topProducts.length > 0 ? `${topProducts[0].count} units sold` : ""}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales by Day */}
            <Card className="neobrutalist-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Sales by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {prepareSalesByDayData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareSalesByDayData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "4px solid black",
                            borderRadius: "0px",
                            padding: "10px",
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="total" stroke="#8884d8" name="Revenue ($)" strokeWidth={3} />
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Number of Sales" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xl font-bold">No sales data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="neobrutalist-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {preparePaymentMethodsData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={preparePaymentMethodsData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {preparePaymentMethodsData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "4px solid black",
                            borderRadius: "0px",
                            padding: "10px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xl font-bold">No payment data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Selling Products */}
            <Card className="neobrutalist-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Top Selling Products</CardTitle>
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
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Units Sold" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xl font-bold">No product data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Product */}
            <Card className="neobrutalist-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Revenue by Product</CardTitle>
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
                        <Legend />
                        <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xl font-bold">No revenue data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={fetchAnalyticsData} className="neobrutalist-button bg-accent text-white">
              Refresh Data
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}