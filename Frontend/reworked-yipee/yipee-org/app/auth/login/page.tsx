"use client"

import { useState, type FormEvent, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFirebase } from "@/lib/firebase/firebase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { updateUserLastLogin } from "@/lib/firebase/user-data-initializer"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, user, database } = useFirebase()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const userCredential = await signIn(email, password)

      // Update last login timestamp
      if (userCredential.user) {
        await updateUserLastLogin(database, userCredential.user.uid)
      }

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="neobrutalist-card p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-black mb-2">YIPEE</h1>
              <p className="text-xl font-bold">Sign in to your account</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 border-4 border-black bg-destructive text-white">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-bold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="neobrutalist-input"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg font-bold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="neobrutalist-input"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="neobrutalist-button w-full bg-primary text-white text-lg py-6"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <p>
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="font-bold underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Legal disclaimer */}
      <div className="flex-1 bg-secondary p-6 md:p-10 flex items-center justify-center">
        <div className="neobrutalist-card p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Legal Disclaimer</h2>
          <div className="space-y-4">
          <p>By accessing and using YIPEE, you agree to comply with all applicable laws and regulations.</p>
            <p>
              All data stored in this application is subject to our privacy policy and terms of service. You are
              responsible for maintaining the confidentiality of your account information.
            </p>
            <p>
              This software is provided "as is" without warranty of any kind, either express or implied, including, but
              not limited to, the implied warranties of merchantability and fitness for a particular purpose.
            </p>
            <p>
              You represent and warrant that you have the legal authority to register and operate the business identified
              in your registration, as well as that the business information provided may be verified by us or our third-party service
              providers, and you consent to such verification.
            </p>
            <p>
              To the maximum extent permitted by applicable law, in no event shall we be liable for any indirect,
              incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data,
              use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use
              the service.
            </p>
            <p className="font-bold">© 2025 YIPEE. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}