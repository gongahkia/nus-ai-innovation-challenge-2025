/* eslint-disable */

import { ref, set, update, type Database, serverTimestamp } from "firebase/database"

// Sample initial inventory items
const initialInventoryItems = [
  {
    id: "sample-product-1",
    name: "Sample Product 1",
    price: 19.99,
    quantity: 50,
    category: "General",
    sku: "SP001",
    createdAt: null, // Will be set to server timestamp
    updatedAt: null, // Will be set to server timestamp
  },
  {
    id: "sample-product-2",
    name: "Sample Product 2",
    price: 29.99,
    quantity: 30,
    category: "General",
    sku: "SP002",
    createdAt: null, // Will be set to server timestamp
    updatedAt: null, // Will be set to server timestamp
  },
  {
    id: "sample-product-3",
    name: "Sample Product 3",
    price: 39.99,
    quantity: 40,
    category: "General",
    sku: "SP003",
    createdAt: null, // Will be set to server timestamp
    updatedAt: null, // Will be set to server timestamp
  }
]

// Initialize user data structure
export const initializeUserData = async (db: Database, userId: string) => {
  try {
    // Create user metadata
    await set(ref(db, `users/${userId}/metadata`), {
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      settings: {
        businessName: "My Business",
        currency: "USD",
        taxRate: 0.0,
        address: "",
        phone: "",
        email: "",
        receiptFooter: "Thank you for your business!",
      },
    })

    // Create initial inventory items
    const inventoryRef = ref(db, `users/${userId}/inventory`)
    const inventoryData: Record<string, any> = {}

    initialInventoryItems.forEach((item) => {
      inventoryData[item.id] = {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    })

    await set(inventoryRef, inventoryData)

    // Create empty sales node
    await set(ref(db, `users/${userId}/sales`), {})

    console.log("User data initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing user data:", error)
    throw error
  }
}

// Function to update user's last login timestamp
export const updateUserLastLogin = async (db: Database, userId: string) => {
  try {
    await update(ref(db, `users/${userId}/metadata`), {
      lastLogin: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating last login:", error)
    return false
  }
}