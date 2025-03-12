"use client"

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { useFirebase } from "./firebase-provider"

// Inventory item type
export type InventoryItem = {
  id?: string
  name: string
  price: number
  quantity: number
  category: string
  sku: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
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
  createdAt?: Timestamp
}

export const useFirestore = () => {
  const { firestore, userId } = useFirebase()

  // Helper function to get user-specific collection reference
  const getUserCollection = (collectionName: string) => {
    if (!userId) throw new Error("User not authenticated")
    return collection(firestore, "users", userId, collectionName)
  }

  // Inventory CRUD operations
  const addInventoryItem = async (item: InventoryItem) => {
    try {
      const itemWithTimestamps = {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
      const inventoryCollection = getUserCollection("inventory")
      const docRef = await addDoc(inventoryCollection, itemWithTimestamps)
      return { id: docRef.id, ...itemWithTimestamps }
    } catch (error) {
      console.error("Error adding inventory item: ", error)
      throw error
    }
  }

  const updateInventoryItem = async (id: string, item: Partial<InventoryItem>) => {
    try {
      if (!userId) throw new Error("User not authenticated")
      const itemRef = doc(firestore, "users", userId, "inventory", id)
      const itemWithTimestamp = {
        ...item,
        updatedAt: Timestamp.now(),
      }
      await updateDoc(itemRef, itemWithTimestamp)
      return { id, ...itemWithTimestamp }
    } catch (error) {
      console.error("Error updating inventory item: ", error)
      throw error
    }
  }

  const deleteInventoryItem = async (id: string) => {
    try {
      if (!userId) throw new Error("User not authenticated")
      await deleteDoc(doc(firestore, "users", userId, "inventory", id))
      return id
    } catch (error) {
      console.error("Error deleting inventory item: ", error)
      throw error
    }
  }

  const getInventoryItems = async () => {
    try {
      const inventoryCollection = getUserCollection("inventory")
      const querySnapshot = await getDocs(inventoryCollection)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryItem[]
    } catch (error) {
      console.error("Error getting inventory items: ", error)
      throw error
    }
  }

  const getInventoryItem = async (id: string) => {
    try {
      if (!userId) throw new Error("User not authenticated")
      const docRef = doc(firestore, "users", userId, "inventory", id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as InventoryItem
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
      const saleWithTimestamp = {
        ...sale,
        createdAt: Timestamp.now(),
      }

      // Add the sale to user's sales collection
      const salesCollection = getUserCollection("sales")
      const docRef = await addDoc(salesCollection, saleWithTimestamp)

      // Update inventory quantities
      for (const item of sale.items) {
        if (!userId) throw new Error("User not authenticated")
        const inventoryRef = doc(firestore, "users", userId, "inventory", item.itemId)
        const inventorySnap = await getDoc(inventoryRef)

        if (inventorySnap.exists()) {
          const inventoryData = inventorySnap.data() as InventoryItem
          await updateDoc(inventoryRef, {
            quantity: inventoryData.quantity - item.quantity,
            updatedAt: Timestamp.now(),
          })
        }
      }

      return { id: docRef.id, ...saleWithTimestamp }
    } catch (error) {
      console.error("Error adding sale: ", error)
      throw error
    }
  }

  const getSales = async () => {
    try {
      const salesCollection = getUserCollection("sales")
      const q = query(salesCollection, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sale[]
    } catch (error) {
      console.error("Error getting sales: ", error)
      throw error
    }
  }

  // Analytics data
  const getSalesByDateRange = async (startDate: Date, endDate: Date) => {
    try {
      const startTimestamp = Timestamp.fromDate(startDate)
      const endTimestamp = Timestamp.fromDate(endDate)

      const salesCollection = getUserCollection("sales")
      const q = query(
        salesCollection,
        where("createdAt", ">=", startTimestamp),
        where("createdAt", "<=", endTimestamp),
        orderBy("createdAt", "asc"),
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
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
      const userDocRef = doc(firestore, "users", userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        return userDoc.data().settings || {}
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
      const userDocRef = doc(firestore, "users", userId)

      await updateDoc(userDocRef, {
        settings: settings,
        updatedAt: Timestamp.now(),
      })

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
    getInventoryItem,
    addSale,
    getSales,
    getSalesByDateRange,
    getTopSellingItems,
    getUserSettings,
    updateUserSettings,
  }
}