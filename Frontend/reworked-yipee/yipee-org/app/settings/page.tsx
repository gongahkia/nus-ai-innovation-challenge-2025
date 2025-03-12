"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useFirestore } from "@/lib/firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type UserSettings = {
  businessName: string
  currency: string
  taxRate: number
  address?: string
  phone?: string
  email?: string
  receiptFooter?: string
}

export default function SettingsPage() {
  const { getUserSettings, updateUserSettings } = useFirestore()
  const { toast } = useToast()
  const [settings, setSettings] = useState<UserSettings>({
    businessName: "",
    currency: "USD",
    taxRate: 0,
    address: "",
    phone: "",
    email: "",
    receiptFooter: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const userSettings = await getUserSettings()
        setSettings({
          ...settings,
          ...userSettings,
        })
      } catch (error) {
        console.error("Error fetching settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setSettings({
      ...settings,
      [name]: name === "taxRate" ? Number.parseFloat(value) || 0 : value,
    })
  }

  const handleCurrencyChange = (value: string) => {
    setSettings({
      ...settings,
      currency: value,
    })
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      await updateUserSettings(settings)
      toast({
        title: "Settings saved",
        description: "Your business settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="neobrutalist-card p-8">
          <h2 className="text-2xl font-bold mb-4">Loading settings...</h2>
          <div className="w-16 h-16 border-8 border-t-accent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black">Business Settings</h1>

      <Card className="neobrutalist-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName" className="font-bold">
              Business Name
            </Label>
            <Input
              id="businessName"
              name="businessName"
              value={settings.businessName}
              onChange={handleInputChange}
              className="neobrutalist-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency" className="font-bold">
                Currency
              </Label>
              <Select value={settings.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger id="currency" className="neobrutalist-input">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="AUD">AUD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate" className="font-bold">
                Tax Rate (%)
              </Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={settings.taxRate}
                onChange={handleInputChange}
                className="neobrutalist-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="neobrutalist-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="font-bold">
              Business Address
            </Label>
            <Input
              id="address"
              name="address"
              value={settings.address || ""}
              onChange={handleInputChange}
              className="neobrutalist-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-bold">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={settings.phone || ""}
                onChange={handleInputChange}
                className="neobrutalist-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">
                Business Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={settings.email || ""}
                onChange={handleInputChange}
                className="neobrutalist-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiptFooter" className="font-bold">
              Receipt Footer Text
            </Label>
            <Input
              id="receiptFooter"
              name="receiptFooter"
              value={settings.receiptFooter || ""}
              onChange={handleInputChange}
              className="neobrutalist-input"
              placeholder="Thank you for your business!"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="neobrutalist-button bg-primary text-white ml-auto"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}