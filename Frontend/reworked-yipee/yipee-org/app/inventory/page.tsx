/* eslint-disable */

"use client"

import type React from "react"

import { useState } from "react"
import { useRealtimeDatabase, type InventoryItem } from "@/lib/firebase/realtime-database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Search } from "lucide-react"

export default function InventoryPage() {
  const { useInventoryItemsRealtime, addInventoryItem, updateInventoryItem, deleteInventoryItem } =
    useRealtimeDatabase()

  const { items: inventory, loading } = useInventoryItemsRealtime()
  const [searchTerm, setSearchTerm] = useState("")

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null)
  const [formData, setFormData] = useState<InventoryItem>({
    name: "",
    price: 0,
    quantity: 0,
    category: "",
    sku: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: name === "price" || name === "quantity" ? Number.parseFloat(value) || 0 : value,
    })
  }

  const handleAddItem = async () => {
    try {
      await addInventoryItem(formData)
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const handleEditItem = async () => {
    if (!currentItem?.id) return

    try {
      await updateInventoryItem(currentItem.id, formData)
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error updating item:", error)
    }
  }

  const handleDeleteItem = async () => {
    if (!currentItem?.id) return

    try {
      await deleteInventoryItem(currentItem.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  const openEditDialog = (item: InventoryItem) => {
    setCurrentItem(item)
    setFormData({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
      sku: item.sku,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (item: InventoryItem) => {
    setCurrentItem(item)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      quantity: 0,
      category: "",
      sku: "",
    })
    setCurrentItem(null)
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-black">Inventory Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="neobrutalist-button bg-primary text-white">
          <Plus className="mr-2" size={20} />
          Add New Item
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="neobrutalist-input pl-10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="neobrutalist-card p-8">
            <h2 className="text-2xl font-bold mb-4">Loading inventory...</h2>
            <div className="w-16 h-16 border-8 border-t-accent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="neobrutalist-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="font-black">Name</TableHead>
                <TableHead className="font-black">SKU</TableHead>
                <TableHead className="font-black">Category</TableHead>
                <TableHead className="font-black text-right">Price</TableHead>
                <TableHead className="font-black text-right">Quantity</TableHead>
                <TableHead className="font-black text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <TableRow key={item.id} className="border-b-2 border-black">
                    <TableCell className="font-bold">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                          className="neobrutalist-button bg-accent text-white h-8 w-8"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openDeleteDialog(item)}
                          className="neobrutalist-button bg-destructive text-white h-8 w-8"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {searchTerm ? "No items match your search" : "No inventory items found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="neobrutalist-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-bold">
                Item Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="neobrutalist-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="font-bold">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="neobrutalist-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="font-bold">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="neobrutalist-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="font-bold">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="neobrutalist-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku" className="font-bold">
                SKU
              </Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="neobrutalist-input"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="neobrutalist-button bg-white">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleAddItem} className="neobrutalist-button bg-primary text-white">
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="neobrutalist-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="font-bold">
                Item Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="neobrutalist-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="font-bold">
                  Price ($)
                </Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="neobrutalist-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-quantity" className="font-bold">
                  Quantity
                </Label>
                <Input
                  id="edit-quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="neobrutalist-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category" className="font-bold">
                Category
              </Label>
              <Input
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="neobrutalist-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sku" className="font-bold">
                SKU
              </Label>
              <Input
                id="edit-sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="neobrutalist-input"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="neobrutalist-button bg-white">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleEditItem} className="neobrutalist-button bg-accent text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="neobrutalist-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-bold">{currentItem?.name}</span>? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="neobrutalist-button bg-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="neobrutalist-button bg-destructive text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}