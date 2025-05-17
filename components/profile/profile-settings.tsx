"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Lock, Mail, Phone, User } from "lucide-react"

export function ProfileSettings() {
  const [settings, setSettings] = useState({
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    password: "",
    newPassword: "",
  })

  const { toast } = useToast()

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setSettings({ ...settings, [name]: value })
  }

  const handleSave = () => {
    // In a real app, this would save settings to the backend
    console.log("Saving settings:", settings)
    toast({
      title: "Settings saved",
      description: "Your profile settings have been updated",
    })
  }

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Profile Settings</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="Your full name"
              className="pl-9"
              value={settings.name}
              onChange={handleChange}
              name="name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-9"
              value={settings.email}
              onChange={handleChange}
              name="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="pl-9"
              value={settings.phone}
              onChange={handleChange}
              name="phone"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Current Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              value={settings.password}
              onChange={handleChange}
              name="password"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              value={settings.newPassword}
              onChange={handleChange}
              name="newPassword"
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-saheli-rose hover:bg-saheli-darkred text-white">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}

