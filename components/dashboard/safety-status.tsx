"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Smartphone, Watch, Bluetooth } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function SafetyStatus() {
  const [sosActive, setSosActive] = useState(false)
  const { toast } = useToast()

  const handleSOS = () => {
    setSosActive(true)
    toast({
      title: "Emergency SOS Activated",
      description: "Alerting your emergency contacts and nearby authorities.",
      variant: "destructive",
    })

    // Simulate response after 5 seconds
    setTimeout(() => {
      toast({
        title: "Emergency Response Initiated",
        description: "Your location has been shared with emergency contacts.",
      })
    }, 5000)
  }

  const handleCancelSOS = () => {
    setSosActive(false)
    toast({
      title: "SOS Deactivated",
      description: "Emergency alert has been cancelled.",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Safety Status</CardTitle>
          <Badge className="bg-green-500">Active</Badge>
        </div>
        <CardDescription>Your current safety monitoring status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Distress Detection</span>
            </div>
            <Badge variant="outline" className="text-green-500 border-green-500">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Offline Alerts</span>
            </div>
            <Badge variant="outline" className="text-green-500 border-green-500">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Location Tracking</span>
            </div>
            <Badge variant="outline" className="text-green-500 border-green-500">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Mobile Device</span>
            </div>
            <Badge variant="outline" className="text-blue-500 border-blue-500">
              Connected
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center">
              <Watch className="h-5 w-5 text-purple-500 mr-2" />
              <span className="font-medium">Smart Watch</span>
            </div>
            <Badge variant="outline" className="text-purple-500 border-purple-500">
              Connected
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="flex items-center">
              <Bluetooth className="h-5 w-5 text-indigo-500 mr-2" />
              <span className="font-medium">Bluetooth Network</span>
            </div>
            <Badge variant="outline" className="text-indigo-500 border-indigo-500">
              5 Devices
            </Badge>
          </div>

          {sosActive ? (
            <div className="space-y-2">
              <Button variant="destructive" className="w-full py-6 text-lg font-bold animate-pulse">
                <AlertTriangle className="mr-2 h-5 w-5" />
                SOS ACTIVE - HELP ON THE WAY
              </Button>
              <Button variant="outline" className="w-full" onClick={handleCancelSOS}>
                Cancel Emergency SOS
              </Button>
            </div>
          ) : (
            <Button variant="destructive" className="w-full py-6 text-lg font-bold" onClick={handleSOS}>
              <AlertTriangle className="mr-2 h-5 w-5" />
              Trigger Emergency SOS
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

