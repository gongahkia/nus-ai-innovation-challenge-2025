/* eslint-disable */

"use client"

import {
  ref,
  push,
  set,
  update,
  remove,
  get,
  query,
  orderByChild,
  startAt,
  endAt,
  onValue,
  off,
  serverTimestamp,
} from "firebase/database"
import { useEffect, useState } from "react"
import { useFirebase } from "./firebase-provider"

// Inventory item type
export type InventoryItem = {
  id?: string
  name: string
  price: number
  quantity: number
  category: string
  sku: string
  createdAt?: any
  updatedAt?: any
}

// Sale type
export type Sale = {
  id?: string
  items: {
    itemId: string
    name: string
    price: number
    quantity: number
  }[]
  total: number
  paymentMethod: string
  customerId?: string
  createdAt?: any
}

export const useRealtimeDatabase = () => {
  const { database, userId } = useFirebase()

  // Helper function to get user-specific reference
  const getUserRef = (path: string) => {
    if (!userId) throw new Error("User not authenticated")
    return ref(database, `users/${userId}/${path}`)
  }

  // Inventory CRUD operations
  const addInventoryItem = async (item: InventoryItem) => {
    try {
      const inventoryRef = getUserRef("inventory")
      const newItemRef = push(inventoryRef)
      const itemId = newItemRef.key

      const itemWithTimestamps = {
        ...item,
        id: itemId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await set(newItemRef, itemWithTimestamps)
      return { ...itemWithTimestamps, id: itemId }
    } catch (error) {
      console.error("Error adding inventory item: ", error)
      throw error
    }
  }

  const updateInventoryItem = async (id: string, item: Partial<InventoryItem>) => {
    try {
      if (!userId) throw new Error("User not authenticated")
      const itemRef = ref(database, `users/${userId}/inventory/${id}`)

      const itemWithTimestamp = {
        ...item,
        updatedAt: serverTimestamp(),
      }

      await update(itemRef, itemWithTimestamp)
      return { id, ...itemWithTimestamp }
    } catch (error) {
      console.error("Error updating inventory item: ", error)
      throw error
    }
  }

  const deleteInventoryItem = async (id: string) => {
    try {
      if (!userId) throw new Error("User not authenticated")
      await remove(ref(database, `users/${userId}/inventory/${id}`))
      return id
    } catch (error) {
      console.error("Error deleting inventory item: ", error)
      throw error
    }
  }

  const getInventoryItems = async () => {
    try {
      const inventoryRef = getUserRef("inventory")
      const snapshot = await get(inventoryRef)

      if (!snapshot.exists()) return []

      const data = snapshot.val()
      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })) as InventoryItem[]
    } catch (error) {
      console.error("Error getting inventory items: ", error)
      throw error
    }
  }

  const useInventoryItemsRealtime = () => {
    const [items, setItems] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
      if (!userId) {
        setLoading(false)
        return
      }

      setLoading(true)
      const inventoryRef = ref(database, `users/${userId}/inventory`)

      const handleData = (snapshot: any) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const itemsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
          setItems(itemsArray)
        } else {
          setItems([])
        }
        setLoading(false)
      }

      const handleError = (err: Error) => {
        console.error("Error fetching inventory items:", err)
        setError(err)
        setLoading(false)
      }

      onValue(inventoryRef, handleData, handleError)

      return () => {
        off(inventoryRef, "value", handleData)
      }
    }, [userId, database])

    return { items, loading, error }
  }

  const getInventoryItem = async (id: string) => {
    try {
      if (!userId) throw new Error("User not authenticated")
      const itemRef = ref(database, `users/${userId}/inventory/${id}`)
      const snapshot = await get(itemRef)

      if (snapshot.exists()) {
        return { id, ...snapshot.val() } as InventoryItem
      } else {
        throw new Error("Inventory item not found")
      }
    } catch (error) {
      console.error("Error getting inventory item: ", error)
      throw error
    }
  }

  // Sales operations
  const addSale = async (sale: Sale) => {
    try {
      const salesRef = getUserRef("sales")
      const newSaleRef = push(salesRef)
      const saleId = newSaleRef.key

      const saleWithTimestamp = {
        ...sale,
        id: saleId,
        createdAt: serverTimestamp(),
      }

      await set(newSaleRef, saleWithTimestamp)

      // Update inventory quantities
      for (const item of sale.items) {
        if (!userId) throw new Error("User not authenticated")
        const inventoryRef = ref(database, `users/${userId}/inventory/${item.itemId}`)
        const snapshot = await get(inventoryRef)

        if (snapshot.exists()) {
          const inventoryData = snapshot.val() as InventoryItem
          await update(inventoryRef, {
            quantity: inventoryData.quantity - item.quantity,
            updatedAt: serverTimestamp(),
          })
        }
      }

      return { ...saleWithTimestamp, id: saleId }
    } catch (error) {
      console.error("Error adding sale: ", error)
      throw error
    }
  }

  const getSales = async () => {
    try {
      const salesRef = getUserRef("sales")
      const snapshot = await get(salesRef)

      if (!snapshot.exists()) return []

      const data = snapshot.val()
      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })) as Sale[]
    } catch (error) {
      console.error("Error getting sales: ", error)
      throw error
    }
  }

  const useSalesRealtime = () => {
    const [sales, setSales] = useState<Sale[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
      if (!userId) {
        setLoading(false)
        return
      }

      setLoading(true)
      const salesRef = ref(database, `users/${userId}/sales`)

      const handleData = (snapshot: any) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const salesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
          // Sort by createdAt in descending order
          salesArray.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0
            return b.createdAt - a.createdAt
          })
          setSales(salesArray)
        } else {
          setSales([])
        }
        setLoading(false)
      }

      const handleError = (err: Error) => {
        console.error("Error fetching sales:", err)
        setError(err)
        setLoading(false)
      }

      onValue(salesRef, handleData, handleError)

      return () => {
        off(salesRef, "value", handleData)
      }
    }, [userId, database])

    return { sales, loading, error }
  }

  // Analytics data
  const getSalesByDateRange = async (startDate: Date, endDate: Date) => {
    try {
      const startTimestamp = startDate.getTime()
      const endTimestamp = endDate.getTime()

      const salesRef = getUserRef("sales")
      const salesQuery = query(salesRef, orderByChild("createdAt"), startAt(startTimestamp), endAt(endTimestamp))

      const snapshot = await get(salesQuery)

      if (!snapshot.exists()) return []

      const data = snapshot.val()
      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })) as Sale[]
    } catch (error) {
      console.error("Error getting sales by date range: ", error)
      throw error
    }
  }

  const getTopSellingItems = async (limit = 5) => {
    try {
      const sales = await getSales()

      // Create a map to count item sales
      const itemSales: Record<string, { name: string; count: number; revenue: number }> = {}

      sales.forEach((sale) => {
        sale.items.forEach((item) => {
          if (!itemSales[item.itemId]) {
            itemSales[item.itemId] = {
              name: item.name,
              count: 0,
              revenue: 0,
            }
          }

          itemSales[item.itemId].count += item.quantity
          itemSales[item.itemId].revenue += item.price * item.quantity
        })
      })

      // Convert to array and sort by count
      return Object.entries(itemSales)
        .map(([id, data]) => ({
          id,
          name: data.name,
          count: data.count,
          revenue: data.revenue,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
    } catch (error) {
      console.error("Error getting top selling items: ", error)
      throw error
    }
  }

  // User settings operations
  const getUserSettings = async () => {
    try {
      if (!userId) throw new Error("User not authenticated")
      const settingsRef = ref(database, `users/${userId}/metadata/settings`)
      const snapshot = await get(settingsRef)

      if (snapshot.exists()) {
        return snapshot.val()
      }

      return {}
    } catch (error) {
      console.error("Error getting user settings:", error)
      throw error
    }
  }

  const updateUserSettings = async (settings: any) => {
    try {
      if (!userId) throw new Error("User not authenticated")
      const settingsRef = ref(database, `users/${userId}/metadata/settings`)

      await set(settingsRef, settings)

      return settings
    } catch (error) {
      console.error("Error updating user settings:", error)
      throw error
    }
  }

  return {
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryItems,
    useInventoryItemsRealtime,
    getInventoryItem,
    addSale,
    getSales,
    useSalesRealtime,
    getSalesByDateRange,
    getTopSellingItems,
    getUserSettings,
    updateUserSettings,
  }
}