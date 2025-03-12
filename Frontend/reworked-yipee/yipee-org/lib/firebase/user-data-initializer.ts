import { doc, setDoc, collection, type Firestore, Timestamp } from "firebase/firestore"

// Sample initial inventory items
const initialInventoryItems = [
  {
    name: "Sample Product 1",
    price: 19.99,
    quantity: 50,
    category: "General",
    sku: "SP001",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Sample Product 2",
    price: 29.99,
    quantity: 30,
    category: "General",
    sku: "SP002",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
]

// Initialize user data structure
export const initializeUserData = async (db: Firestore, userId: string) => {
  try {
    // Create user document with metadata
    await setDoc(doc(db, "users", userId), {
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      settings: {
        businessName: "My Business",
        currency: "USD",
        taxRate: 0.0,
      },
    })

    // Create initial inventory items
    const inventoryCollectionRef = collection(db, "users", userId, "inventory")
    for (const item of initialInventoryItems) {
      await setDoc(doc(inventoryCollectionRef), item)
    }

    // Create empty sales collection
    // We don't need to add documents, just ensuring the path exists
    collection(db, "users", userId, "sales")

    console.log("User data initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing user data:", error)
    throw error
  }
}

// Function to update user's last login timestamp
export const updateUserLastLogin = async (db: Firestore, userId: string) => {
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        lastLogin: Timestamp.now(),
      },
      { merge: true },
    )
    return true
  } catch (error) {
    console.error("Error updating last login:", error)
    return false
  }
}