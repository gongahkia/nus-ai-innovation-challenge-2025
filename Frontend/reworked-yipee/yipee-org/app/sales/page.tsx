/* eslint-disable */

"use client"

import { useState } from "react"
import { useRealtimeDatabase, type Sale } from "@/lib/firebase/realtime-database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, Calendar } from "lucide-react"
import { format } from "date-fns"

export default function SalesPage() {
  const { useSalesRealtime } = useRealtimeDatabase()
  const { sales, loading } = useSalesRealtime()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const openSaleDetails = (sale: Sale) => {
    setSelectedSale(sale)
    setIsDetailsDialogOpen(true)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"

    try {
      // Handle both Firebase server timestamp and regular Date objects
      const date =
        typeof timestamp === "object" && timestamp !== null && "toDate" in timestamp
          ? timestamp.toDate()
          : new Date(timestamp)
      return format(date, "MMM d, yyyy h:mm a")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  const filteredSales = sales.filter((sale) => {
    const searchLower = searchTerm.toLowerCase()

    // Search by payment method
    if (sale.paymentMethod.toLowerCase().includes(searchLower)) {
      return true
    }

    // Search by item name
    const hasMatchingItem = sale.items.some((item) => item.name.toLowerCase().includes(searchLower))

    return hasMatchingItem
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-black">Sales History</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neobrutalist-input pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="neobrutalist-card p-8">
            <h2 className="text-2xl font-bold mb-4">Loading sales data...</h2>
            <div className="w-16 h-16 border-8 border-t-accent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="neobrutalist-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="font-black">Date</TableHead>
                <TableHead className="font-black">Items</TableHead>
                <TableHead className="font-black">Payment Method</TableHead>
                <TableHead className="font-black text-right">Total</TableHead>
                <TableHead className="font-black text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id} className="border-b-2 border-black">
                    <TableCell className="font-medium">{formatDate(sale.createdAt)}</TableCell>
                    <TableCell>
                      {sale.items.length} {sale.items.length === 1 ? "item" : "items"}
                    </TableCell>
                    <TableCell className="capitalize">{sale.paymentMethod}</TableCell>
                    <TableCell className="text-right font-bold">${sale.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSaleDetails(sale)}
                        className="neobrutalist-button bg-accent text-white"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {searchTerm ? "No sales match your search" : "No sales records found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Sale Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="neobrutalist-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Sale Details</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{formatDate(selectedSale.createdAt)}</span>
              </div>

              <Card className="neobrutalist-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Items Purchased</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted hover:bg-muted">
                        <TableHead className="font-bold">Item</TableHead>
                        <TableHead className="font-bold text-right">Price</TableHead>
                        <TableHead className="font-bold text-right">Qty</TableHead>
                        <TableHead className="font-bold text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.items.map((item, index) => (
                        <TableRow key={index} className="border-b border-black">
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center border-t-2 border-black pt-4">
                <div>
                  <p className="font-bold">Payment Method</p>
                  <p className="capitalize">{selectedSale.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Total Amount</p>
                  <p className="text-2xl font-black">${selectedSale.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button className="neobrutalist-button bg-primary text-white">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}