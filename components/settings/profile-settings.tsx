"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Bell, Shield, Lock, Eye, Save } from "lucide-react"

export function ProfileSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      safetyAlerts: true,
      communityUpdates: true,
      travelReminders: true,
      marketingEmails: false,
    },
    privacy: {
      shareLocation: true,
      shareActivity: false,
      profileVisibility: "friends", // "public", "friends", "private"
      allowContactByPhone: true,
    },
    safety: {
      autoSOS: true,
      geofenceAlerts: true,
      dangerZoneWarnings: true,
      safetyRadius: 300, // in meters
    },
  })

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    })
  }

  const handlePrivacyChange = (key: keyof typeof settings.privacy) => {
    if (typeof settings.privacy[key] === "boolean") {
      setSettings({
        ...settings,
        privacy: {
          ...settings.privacy,
          [key]: !settings.privacy[key],
        },
      })
    }
  }

  const handleSafetyChange = (key: keyof typeof settings.safety) => {
    if (key !== "safetyRadius" && typeof settings.safety[key] === "boolean") {
      setSettings({
        ...settings,
        safety: {
          ...settings.safety,
          [key]: !settings.safety[key],
        },
      })
    }
  }

  const handleSafetyRadiusChange = (value: number[]) => {
    setSettings({
      ...settings,
      safety: {
        ...settings.safety,
        safetyRadius: value[0],
      },
    })
  }

  const saveSettings = () => {
    // In a real app, this would save settings to the backend
    console.log("Saving settings:", settings)
  }

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </div>
          <Button onClick={saveSettings} className="bg-saheli-rose hover:bg-saheli-rose/90 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Notifications Section */}
          <div>
            <h3 className="text-base font-medium mb-3 flex items-center">
              <Bell className="h-4 w-4 mr-2 text-saheli-rose" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="safety-alerts" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Safety Alerts</div>
                  <div className="text-xs text-muted-foreground">Receive alerts about safety incidents</div>
                </Label>
                <Switch
                  id="safety-alerts"
                  checked={settings.notifications.safetyAlerts}
                  onCheckedChange={() => handleNotificationChange("safetyAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="community-updates" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Community Updates</div>
                  <div className="text-xs text-muted-foreground">Get updates from the community</div>
                </Label>
                <Switch
                  id="community-updates"
                  checked={settings.notifications.communityUpdates}
                  onCheckedChange={() => handleNotificationChange("communityUpdates")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="travel-reminders" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Travel Reminders</div>
                  <div className="text-xs text-muted-foreground">Receive reminders about upcoming trips</div>
                </Label>
                <Switch
                  id="travel-reminders"
                  checked={settings.notifications.travelReminders}
                  onCheckedChange={() => handleNotificationChange("travelReminders")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing-emails" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Marketing Emails</div>
                  <div className="text-xs text-muted-foreground">Receive promotional emails and offers</div>
                </Label>
                <Switch
                  id="marketing-emails"
                  checked={settings.notifications.marketingEmails}
                  onCheckedChange={() => handleNotificationChange("marketingEmails")}
                />
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div>
            <h3 className="text-base font-medium mb-3 flex items-center">
              <Eye className="h-4 w-4 mr-2 text-saheli-purple" />
              Privacy
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="share-location" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Share Location</div>
                  <div className="text-xs text-muted-foreground">Allow trusted contacts to see your location</div>
                </Label>
                <Switch
                  id="share-location"
                  checked={settings.privacy.shareLocation}
                  onCheckedChange={() => handlePrivacyChange("shareLocation")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="share-activity" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Share Activity</div>
                  <div className="text-xs text-muted-foreground">Share your activity with the community</div>
                </Label>
                <Switch
                  id="share-activity"
                  checked={settings.privacy.shareActivity}
                  onCheckedChange={() => handlePrivacyChange("shareActivity")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-contact" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Allow Contact by Phone</div>
                  <div className="text-xs text-muted-foreground">Allow other users to contact you by phone</div>
                </Label>
                <Switch
                  id="allow-contact"
                  checked={settings.privacy.allowContactByPhone}
                  onCheckedChange={() => handlePrivacyChange("allowContactByPhone")}
                />
              </div>
            </div>
          </div>

          {/* Safety Section */}
          <div>
            <h3 className="text-base font-medium mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-saheli-rose" />
              Safety
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-sos" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Auto SOS</div>
                  <div className="text-xs text-muted-foreground">Automatically trigger SOS in dangerous situations</div>
                </Label>
                <Switch
                  id="auto-sos"
                  checked={settings.safety.autoSOS}
                  onCheckedChange={() => handleSafetyChange("autoSOS")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="geofence-alerts" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Geofence Alerts</div>
                  <div className="text-xs text-muted-foreground">Get alerts when entering or leaving safe zones</div>
                </Label>
                <Switch
                  id="geofence-alerts"
                  checked={settings.safety.geofenceAlerts}
                  onCheckedChange={() => handleSafetyChange("geofenceAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="danger-warnings" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Danger Zone Warnings</div>
                  <div className="text-xs text-muted-foreground">Receive warnings when approaching danger zones</div>
                </Label>
                <Switch
                  id="danger-warnings"
                  checked={settings.safety.dangerZoneWarnings}
                  onCheckedChange={() => handleSafetyChange("dangerZoneWarnings")}
                />
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="safety-radius" className="cursor-pointer">
                    <div className="font-medium text-sm">Safety Radius</div>
                    <div className="text-xs text-muted-foreground">
                      Distance for safety alerts ({settings.safety.safetyRadius}m)
                    </div>
                  </Label>
                </div>
                <Slider
                  id="safety-radius"
                  min={100}
                  max={1000}
                  step={50}
                  value={[settings.safety.safetyRadius]}
                  onValueChange={handleSafetyRadiusChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>100m</span>
                  <span>500m</span>
                  <span>1000m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div>
            <h3 className="text-base font-medium mb-3 flex items-center">
              <Lock className="h-4 w-4 mr-2 text-saheli-teal" />
              Account Security
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-foreground">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start text-foreground">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start text-foreground">
                Manage Linked Accounts
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

