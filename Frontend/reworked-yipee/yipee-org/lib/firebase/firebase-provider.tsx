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
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "./firebase-config"

// Initialize Firebase
let app: any
let auth: any
let db: any

// Only initialize on the client side
if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
}

type FirebaseContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  firestore: any
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user)
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [])

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
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
    firestore: db,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}