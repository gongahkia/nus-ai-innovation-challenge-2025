/* eslint-disable */

"use client"

import { useState } from "react"
import { useRealtimeDatabase, type InventoryItem, type Sale } from "@/lib/firebase/realtime-database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, Plus, Minus, ShoppingCart, X, Check } from "lucide-react"
import { useRouter } from "next/navigation"

type CartItem = {
  itemId: string
  name: string
  price: number
  quantity: number
}

export default function POSPage() {
  const { useInventoryItemsRealtime, addSale } = useRealtimeDatabase()
  const { items: inventory, loading } = useInventoryItemsRealtime()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)

  const addToCart = (item: InventoryItem) => {
    if (!item.id || item.quantity <= 0) return

    const existingItemIndex = cart.findIndex((cartItem) => cartItem.itemId === item.id)

    if (existingItemIndex >= 0) {
      // Item already in cart, increase quantity
      const updatedCart = [...cart]
      if (updatedCart[existingItemIndex].quantity < item.quantity) {
        updatedCart[existingItemIndex].quantity += 1
        setCart(updatedCart)
      }
    } else {
      // Add new item to cart
      setCart([
        ...cart,
        {
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ])
    }
  }

  const removeFromCart = (index: number) => {
    const updatedCart = [...cart]
    updatedCart.splice(index, 1)
    setCart(updatedCart)
  }

  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    const item = cart[index]
    const inventoryItem = inventory.find((i) => i.id === item.itemId)

    if (!inventoryItem) return

    // Ensure quantity is within bounds
    newQuantity = Math.max(1, Math.min(newQuantity, inventoryItem.quantity))

    const updatedCart = [...cart]
    updatedCart[index].quantity = newQuantity
    setCart(updatedCart)
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    try {
      const sale: Sale = {
        items: cart,
        total: calculateTotal(),
        paymentMethod,
      }

      await addSale(sale)
      setIsCheckoutDialogOpen(false)
      setIsSuccessDialogOpen(true)
      setCart([])
    } catch (error) {
      console.error("Error processing sale:", error)
    }
  }

  const filteredInventory = inventory.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
      item.quantity > 0,
  )

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black">Point of Sale</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neobrutalist-input pl-10"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="neobrutalist-card p-8">
                <h2 className="text-2xl font-bold mb-4">Loading products...</h2>
                <div className="w-16 h-16 border-8 border-t-accent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredInventory.map((item) => (
                <Card
                  key={item.id}
                  className="neobrutalist-card cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => addToCart(item)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    <p className="text-sm text-muted-foreground">In stock: {item.quantity}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
                  </CardFooter>
                </Card>
              ))}

              {filteredInventory.length === 0 && (
                <div className="col-span-full neobrutalist-card p-8 text-center">
                  <p className="text-xl font-bold">
                    {searchTerm ? "No products match your search" : "No products available"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shopping Cart */}
        <div className="space-y-4">
          <Card className="neobrutalist-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <ShoppingCart className="mr-2" size={20} />
                Shopping Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                      <TableHead className="font-bold">Item</TableHead>
                      <TableHead className="font-bold text-right">Price</TableHead>
                      <TableHead className="font-bold text-right">Qty</TableHead>
                      <TableHead className="font-bold text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item, index) => (
                      <TableRow key={index} className="border-b-2 border-black">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 neobrutalist-button bg-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateCartItemQuantity(index, item.quantity - 1)
                              }}
                            >
                              <Minus size={12} />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 neobrutalist-button bg-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateCartItemQuantity(index, item.quantity + 1)
                              }}
                            >
                              <Plus size={12} />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 neobrutalist-button bg-destructive text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFromCart(index)
                            }}
                          >
                            <X size={12} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-lg font-bold">Your cart is empty</p>
                  <p className="text-muted-foreground">Add items to get started</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col space-y-4 border-t-2 border-black pt-4">
              <div className="flex justify-between w-full">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-black">${calculateTotal().toFixed(2)}</span>
              </div>
              <Button
                onClick={() => setIsCheckoutDialogOpen(true)}
                disabled={cart.length === 0}
                className="neobrutalist-button w-full bg-primary text-white text-lg py-6"
              >
                Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="neobrutalist-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Complete Purchase</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method" className="font-bold">
                Payment Method
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="neobrutalist-input">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="debit">Debit Card</SelectItem>
                  <SelectItem value="mobile">Mobile Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="neobrutalist-card p-4 bg-muted">
              <h3 className="font-bold mb-2">Order Summary</h3>
              <div className="space-y-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t-2 border-black pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCheckoutDialogOpen(false)}
              className="neobrutalist-button bg-white"
            >
              Cancel
            </Button>
            <Button onClick={handleCheckout} className="neobrutalist-button bg-primary text-white">
              Complete Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="neobrutalist-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Sale Complete!</DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-center text-lg">The sale has been successfully processed.</p>
          </div>
          <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
            <Button
              onClick={() => {
                setIsSuccessDialogOpen(false)
                router.push("/sales")
              }}
              className="neobrutalist-button bg-accent text-white w-full sm:w-auto"
            >
              View Sales
            </Button>
            <Button
              onClick={() => setIsSuccessDialogOpen(false)}
              className="neobrutalist-button bg-primary text-white w-full sm:w-auto"
            >
              New Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}