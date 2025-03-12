"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { getDatabase } from "firebase/database"
import { firebaseConfig } from "./firebase-config"
import { initializeUserData } from "./user-data-initializer"

// Initialize Firebase
let app: any
let auth: any
let db: any

// Only initialize on the client side
if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getDatabase(app)
}

type FirebaseContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  database: any
  userId: string | null
}

const FirebaseContext = createContext<FirebaseContextType | null>(null)

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user)
        setUserId(user?.uid || null)
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [])

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Initialize the user's database structure
      if (userCredential.user) {
        await initializeUserData(db, userCredential.user.uid)
      }

      return userCredential
    } catch (error) {
      console.error("Error during sign up:", error)
      throw error
    }
  }

  const signOut = () => {
    return firebaseSignOut(auth)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    database: db,
    userId,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}