"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFirebase } from "@/lib/firebase/firebase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signUp } = useFirebase()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions")
      return
    }

    setLoading(true)

    try {
      await signUp(email, password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Register form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="neobrutalist-card p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-black mb-2">NEOPOS</h1>
              <p className="text-xl font-bold">Create your account</p>
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

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-lg font-bold">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="neobrutalist-input"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="neobrutalist-input h-5 w-5 mt-1"
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the Terms of Service and Privacy Policy. I understand that my personal data will be
                  processed as described in the Privacy Policy.
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="neobrutalist-button w-full bg-primary text-white text-lg py-6"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              <div className="text-center">
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-bold underline">
                    Sign in
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
            <p>By creating an account, you agree to comply with all applicable laws and regulations.</p>
            <p>
              All data stored in this application is subject to our privacy policy and terms of service. You are
              responsible for maintaining the confidentiality of your account information.
            </p>
            <p>
              This software is provided "as is" without warranty of any kind, either express or implied, including, but
              not limited to, the implied warranties of merchantability and fitness for a particular purpose.
            </p>
            <p className="font-bold">© 2025 NEOPOS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}