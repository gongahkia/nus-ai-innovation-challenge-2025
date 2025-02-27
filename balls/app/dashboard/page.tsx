"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, BarChart3, Package, ScanLine, Bell } from "lucide-react"
import StockManagement from "@/components/stock-management"
import PosScanner from "@/components/pos-scanner"
import SalesAnalytics from "@/components/sales-analytics"
import NotificationsPanel from "@/components/notifications-panel"

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("stock")

  // In a real app, this would check if the user is authenticated
  useEffect(() => {
    // For now, we'll just assume they're logged in
    // Later, this would check Firebase auth state
  }, [])

  const handleLogout = () => {
    // In a real app, this would sign out the user from Firebase
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gruvbox-bg text-gruvbox-fg">
      <header className="bg-gruvbox-bg border-b-4 border-gruvbox-fg">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-black text-gruvbox-fg">Balls Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-gruvbox-red"></span>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 neobrutalist-button">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <Tabs defaultValue="stock" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="stock" className="neobrutalist-button flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Stock Management
                </TabsTrigger>
                <TabsTrigger value="pos" className="neobrutalist-button flex items-center gap-2">
                  <ScanLine className="h-4 w-4" />
                  POS Scanner
                </TabsTrigger>
                <TabsTrigger value="analytics" className="neobrutalist-button flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Sales Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stock" className="mt-0">
                <StockManagement />
              </TabsContent>

              <TabsContent value="pos" className="mt-0">
                <PosScanner />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <SalesAnalytics />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:w-1/4">
            <NotificationsPanel />
          </div>
        </div>
      </main>
    </div>
  )
}