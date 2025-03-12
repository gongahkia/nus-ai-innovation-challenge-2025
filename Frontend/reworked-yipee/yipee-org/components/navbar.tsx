"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useFirebase } from "@/lib/firebase/firebase-provider"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { user, signOut } = useFirebase()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/inventory", label: "Inventory" },
    { href: "/pos", label: "POS" },
    { href: "/sales", label: "Sales" },
    { href: "/analytics", label: "Analytics" },
    { href: "/settings", label: "Settings" },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (!user) return null

  return (
    <header className="border-b-4 border-black bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="font-black text-2xl">
            YIPEE
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden neobrutalist-button p-2 bg-white" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`neobrutalist-button px-4 py-2 ${
                  pathname === link.href ? "bg-accent text-white" : "bg-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button onClick={handleSignOut} className="neobrutalist-button bg-destructive text-white">
              Sign Out
            </Button>
          </nav>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t-4 border-black">
          <div className="flex flex-col space-y-2 p-4 bg-secondary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`neobrutalist-button px-4 py-2 text-center ${
                  pathname === link.href ? "bg-accent text-white" : "bg-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button onClick={handleSignOut} className="neobrutalist-button bg-destructive text-white w-full">
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}