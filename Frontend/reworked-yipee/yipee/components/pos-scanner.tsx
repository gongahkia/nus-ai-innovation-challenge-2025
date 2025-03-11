"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanLine, FileText, Check, AlertCircle, Camera, FileImage, Grid } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function PosScanner() {
  const [scanState, setScanState] = useState<"idle" | "scanning" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [scanResults, setScanResults] = useState<any>(null)

  // Mock scan results data
  const mockScanResults = {
    receiptId: "POS-2023-11-28-0042",
    date: "2023-11-28",
    time: "14:32:45",
    items: [
      { id: 1, name: "Pasta", quantity: 5, price: 2.99, total: 14.95 },
      { id: 2, name: "Tomato Sauce", quantity: 3, price: 1.79, total: 5.37 },
      { id: 3, name: "Olive Oil", quantity: 1, price: 8.99, total: 8.99 },
      { id: 4, name: "Parmesan Cheese", quantity: 1, price: 4.49, total: 4.49 },
    ],
    subtotal: 33.8,
    tax: 2.7,
    total: 36.5,
    paymentMethod: "Credit Card",
  }

  const handleScan = () => {
    setScanState("scanning")
    setProgress(0)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setScanState("success")
          setScanResults(mockScanResults)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScanState("scanning")
      setProgress(0)

      // Simulate scanning progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setScanState("success")
            setScanResults(mockScanResults)
            return 100
          }
          return prev + 10
        })
      }, 300)
    }
  }

  const resetScan = () => {
    setScanState("idle")
    setProgress(0)
    setScanResults(null)
  }

  const IntegrationButton = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
    <Button variant="outline" className="flex items-center gap-2 w-full" style={{ borderColor: color }}>
      {icon}
      <span className="sr-only md:not-sr-only">{label}</span>
    </Button>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>POS Receipt Scanner</CardTitle>
          <CardDescription>Scan your Point of Sale receipts to automatically update inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {scanState === "idle" && (
            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg">
              <ScanLine className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Scan Your Receipt</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Use your camera to scan a receipt or upload an image file
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <Button onClick={handleScan} className="flex items-center gap-2 w-full">
                  <Camera className="h-4 w-4" />
                  Scan with Camera
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="flex items-center gap-2 w-full">
                    <FileImage className="h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>
              <div className="mt-6 w-full max-w-md">
                <p className="text-sm text-muted-foreground text-center mb-2">Or import from:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <IntegrationButton
                    icon={
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#4285F4">
                        <path d="M12 0C5.372 0 0 5.372 0 12c0 6.627 5.372 12 12 12 6.627 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm.14 19.018c-3.868 0-7-3.14-7-7.018 0-3.878 3.132-7.018 7-7.018 1.89 0 3.47.697 4.682 1.829l-1.974 1.978v-.004c-.735-.702-1.667-1.062-2.708-1.062-2.31 0-4.187 1.956-4.187 4.273 0 2.315 1.877 4.277 4.187 4.277 2.096 0 3.522-1.202 3.816-2.852H12.14v-2.737h6.585c.088.47.135.96.135 1.474 0 4.01-2.677 6.86-6.72 6.86z" />
                      </svg>
                    }
                    label="Google Drive"
                    color="#4285F4"
                  />
                  <IntegrationButton
                    icon={
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#0061FF">
                        <path d="M12 0C5.372 0 0 5.372 0 12c0 6.627 5.372 12 12 12 6.627 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm0 10.5L7.5 15h9L12 10.5zM7.5 9h9L12 4.5 7.5 9z" />
                      </svg>
                    }
                    label="Dropbox"
                    color="#0061FF"
                  />
                  <IntegrationButton
                    icon={
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#217346">
                        <path d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z" />
                      </svg>
                    }
                    label="Excel"
                    color="#217346"
                  />
                  <IntegrationButton icon={<Grid className="h-4 w-4" />} label="More" color="#6b7280" />
                </div>
              </div>
            </div>
          )}

          {scanState === "scanning" && (
            <div className="flex flex-col items-center justify-center p-10">
              <ScanLine className="h-16 w-16 text-primary animate-pulse mb-4" />
              <h3 className="text-lg font-medium mb-2">Scanning Receipt...</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Please wait while we process your receipt
              </p>
              <div className="w-full max-w-md mb-2">
                <Progress value={progress} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">{progress}% Complete</p>
            </div>
          )}

          {scanState === "success" && scanResults && (
            <div className="space-y-6">
              <Alert variant="success" className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Scan Successful</AlertTitle>
                <AlertDescription className="text-green-700">
                  Receipt has been successfully scanned and processed.
                </AlertDescription>
              </Alert>

              <div className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Receipt Details</h3>
                    <p className="text-sm text-muted-foreground">ID: {scanResults.receiptId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{scanResults.date}</p>
                    <p className="text-sm text-muted-foreground">{scanResults.time}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-muted-foreground">
                        <th className="text-left pb-2">Item</th>
                        <th className="text-center pb-2">Qty</th>
                        <th className="text-right pb-2">Price</th>
                        <th className="text-right pb-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scanResults.items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-2">{item.name}</td>
                          <td className="py-2 text-center">{item.quantity}</td>
                          <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                          <td className="py-2 text-right">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t">
                        <td colSpan={3} className="pt-2 text-right font-medium">
                          Subtotal:
                        </td>
                        <td className="pt-2 text-right">${scanResults.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="pt-1 text-right font-medium">
                          Tax:
                        </td>
                        <td className="pt-1 text-right">${scanResults.tax.toFixed(2)}</td>
                      </tr>
                      <tr className="text-lg">
                        <td colSpan={3} className="pt-2 text-right font-bold">
                          Total:
                        </td>
                        <td className="pt-2 text-right font-bold">${scanResults.total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Payment Method:</span> {scanResults.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          )}

          {scanState === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Scan Failed</AlertTitle>
              <AlertDescription>
                We couldn't process your receipt. Please try again or upload a clearer image.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {scanState !== "idle" && (
            <Button variant="outline" onClick={resetScan}>
              Scan Another Receipt
            </Button>
          )}

          {scanState === "success" && (
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Update Inventory
            </Button>
          )}

          {scanState === "idle" && (
            <div className="text-sm text-muted-foreground">Supported formats: JPG, PNG, PDF</div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}