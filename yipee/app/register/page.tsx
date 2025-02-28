"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import LegalDisclaimer from "@/components/legal-disclaimer"

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    ownerNames: "",
    annualIncome: "",
    businessLocation: "",
    hasPhysicalLocation: false,
    username: "",
    password: "",
    confirmPassword: "",
    recoveryEmail: "",
    recoveryPhone: "",
    acceptTerms: false,
  })
  const [error, setError] = useState("")
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!formData.username || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.acceptTerms) {
      setError("You must accept the terms and conditions")
      return
    }

    // In a real app, this would send data to Firebase
    console.log("Registration data:", formData)

    // Redirect to success page or login
    router.push("/registration-success")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto py-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <main className="flex-1 container mx-auto py-12">
          <Card className="max-w-2xl mx-auto shadow-lg neobrutalist-card">
            <CardHeader>
              <CardTitle className="text-2xl">Balls Registration</CardTitle>
              <CardDescription>Create a new account to access Balls services</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Business Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Enter business name"
                        required
                        className="neobrutalist-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange("industry", value)}
                        value={formData.industry}
                      >
                        <SelectTrigger className="neobrutalist-input">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerNames">Owner Name(s)</Label>
                    <Input
                      id="ownerNames"
                      name="ownerNames"
                      value={formData.ownerNames}
                      onChange={handleChange}
                      placeholder="Enter owner name(s)"
                      required
                      className="neobrutalist-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="annualIncome">Annual Income</Label>
                      <Input
                        id="annualIncome"
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleChange}
                        placeholder="Enter annual income"
                        required
                        className="neobrutalist-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessLocation">Business Location</Label>
                      <Input
                        id="businessLocation"
                        name="businessLocation"
                        value={formData.businessLocation}
                        onChange={handleChange}
                        placeholder="Enter business location"
                        required
                        className="neobrutalist-input"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasPhysicalLocation"
                      checked={formData.hasPhysicalLocation}
                      onCheckedChange={(checked) => handleCheckboxChange("hasPhysicalLocation", checked as boolean)}
                    />
                    <Label htmlFor="hasPhysicalLocation">Business has a physical location</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        required
                        className="neobrutalist-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recoveryEmail">Recovery Email</Label>
                      <Input
                        id="recoveryEmail"
                        name="recoveryEmail"
                        type="email"
                        value={formData.recoveryEmail}
                        onChange={handleChange}
                        placeholder="Enter recovery email"
                        required
                        className="neobrutalist-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                        className="neobrutalist-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        className="neobrutalist-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recoveryPhone">Recovery Phone Number</Label>
                    <Input
                      id="recoveryPhone"
                      name="recoveryPhone"
                      value={formData.recoveryPhone}
                      onChange={handleChange}
                      placeholder="Enter recovery phone number"
                      required
                      className="neobrutalist-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleCheckboxChange("acceptTerms", checked as boolean)}
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      I accept the{" "}
                      <button type="button" className="text-primary underline" onClick={() => setShowDisclaimer(true)}>
                        terms and conditions
                      </button>
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full neobrutalist-button">
                  Register
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>

        <footer className="container mx-auto py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Balls. All rights reserved.
        </footer>
      </div>

      {showDisclaimer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl max-h-[80vh] overflow-auto p-6 w-full">
            <h2 className="text-xl font-bold mb-4">Legal Disclaimer</h2>
            <LegalDisclaimer />
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowDisclaimer(false)} className="neobrutalist-button">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}