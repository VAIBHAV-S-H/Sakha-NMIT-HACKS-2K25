"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Shield, Lock, Eye, Save, Smartphone, Headphones, Fingerprint } from "lucide-react"

export function SettingsPanel() {
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
      sosShakeActivation: true,
      sosVoiceActivation: false,
      sosButtonPressTime: 3, // in seconds
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
    if (key !== "safetyRadius" && key !== "sosButtonPressTime" && typeof settings.safety[key] === "boolean") {
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

  const handleSOSButtonPressTimeChange = (value: number[]) => {
    setSettings({
      ...settings,
      safety: {
        ...settings.safety,
        sosButtonPressTime: value[0],
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
            <CardTitle className="text-xl font-bold font-serif">Settings</CardTitle>
            <CardDescription className="font-sans">Manage your account preferences</CardDescription>
          </div>
          <Button onClick={saveSettings} className="bg-primary hover:bg-primary/90 text-white font-medium">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="notifications" className="font-sans">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="font-sans">
              Privacy
            </TabsTrigger>
            <TabsTrigger value="safety" className="font-sans">
              Safety
            </TabsTrigger>
            <TabsTrigger value="security" className="font-sans">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <div>
              <h3 className="text-base font-medium mb-3 flex items-center font-serif">
                <Bell className="h-4 w-4 mr-2 text-primary" />
                Notification Settings
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="safety-alerts" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Safety Alerts</div>
                    <div className="text-xs text-muted-foreground font-sans">Receive alerts about safety incidents</div>
                  </Label>
                  <Switch
                    id="safety-alerts"
                    checked={settings.notifications.safetyAlerts}
                    onCheckedChange={() => handleNotificationChange("safetyAlerts")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="community-updates" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Community Updates</div>
                    <div className="text-xs text-muted-foreground font-sans">Get updates from the community</div>
                  </Label>
                  <Switch
                    id="community-updates"
                    checked={settings.notifications.communityUpdates}
                    onCheckedChange={() => handleNotificationChange("communityUpdates")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="travel-reminders" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Travel Reminders</div>
                    <div className="text-xs text-muted-foreground font-sans">
                      Receive reminders about upcoming trips
                    </div>
                  </Label>
                  <Switch
                    id="travel-reminders"
                    checked={settings.notifications.travelReminders}
                    onCheckedChange={() => handleNotificationChange("travelReminders")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing-emails" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Marketing Emails</div>
                    <div className="text-xs text-muted-foreground font-sans">Receive promotional emails and offers</div>
                  </Label>
                  <Switch
                    id="marketing-emails"
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={() => handleNotificationChange("marketingEmails")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div>
              <h3 className="text-base font-medium mb-3 flex items-center font-serif">
                <Eye className="h-4 w-4 mr-2 text-accent" />
                Privacy Settings
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-location" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Share Location</div>
                    <div className="text-xs text-muted-foreground font-sans">
                      Allow trusted contacts to see your location
                    </div>
                  </Label>
                  <Switch
                    id="share-location"
                    checked={settings.privacy.shareLocation}
                    onCheckedChange={() => handlePrivacyChange("shareLocation")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-activity" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Share Activity</div>
                    <div className="text-xs text-muted-foreground font-sans">
                      Share your activity with the community
                    </div>
                  </Label>
                  <Switch
                    id="share-activity"
                    checked={settings.privacy.shareActivity}
                    onCheckedChange={() => handlePrivacyChange("shareActivity")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-contact" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Allow Contact by Phone</div>
                    <div className="text-xs text-muted-foreground font-sans">
                      Allow other users to contact you by phone
                    </div>
                  </Label>
                  <Switch
                    id="allow-contact"
                    checked={settings.privacy.allowContactByPhone}
                    onCheckedChange={() => handlePrivacyChange("allowContactByPhone")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <div>
              <h3 className="text-base font-medium mb-3 flex items-center font-serif">
                <Shield className="h-4 w-4 mr-2 text-primary" />
                Safety Settings
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-sos" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Auto SOS</div>
                    <div className="text-xs text-muted-foreground font-sans">
                      Automatically trigger SOS in dangerous situations
                    </div>
                  </Label>
                  <Switch
                    id="auto-sos"
                    checked={settings.safety.autoSOS}
                    onCheckedChange={() => handleSafetyChange("autoSOS")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="geofence-alerts" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Geofence Alerts</div>
                    <div className="text-xs text-muted-foreground font-sans">
                      Get alerts when entering or leaving safe zones
                    </div>
                  </Label>
                  <Switch
                    id="geofence-alerts"
                    checked={settings.safety.geofenceAlerts}
                    onCheckedChange={() => handleSafetyChange("geofenceAlerts")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="danger-warnings" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Danger Zone Warnings</div>
                    <div className="text-xs text-muted-foreground font-sans">
                      Receive warnings when approaching danger zones
                    </div>
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
                      <div className="font-medium text-sm font-sans">Safety Radius</div>
                      <div className="text-xs text-muted-foreground font-sans">
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
                  <div className="flex justify-between text-xs text-muted-foreground mt-1 font-sans">
                    <span>100m</span>
                    <span>500m</span>
                    <span>1000m</span>
                  </div>
                </div>

                <h4 className="text-sm font-medium mt-4 mb-2 font-serif">SOS Activation Settings</h4>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sos-shake" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Shake to Activate SOS</div>
                    <div className="text-xs text-muted-foreground font-sans">
                      Rapidly shake your phone to trigger SOS
                    </div>
                  </Label>
                  <Switch
                    id="sos-shake"
                    checked={settings.safety.sosShakeActivation}
                    onCheckedChange={() => handleSafetyChange("sosShakeActivation")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sos-voice" className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm font-sans">Voice Activation</div>
                    <div className="text-xs text-muted-foreground font-sans">Say "Help" three times to trigger SOS</div>
                  </Label>
                  <Switch
                    id="sos-voice"
                    checked={settings.safety.sosVoiceActivation}
                    onCheckedChange={() => handleSafetyChange("sosVoiceActivation")}
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="sos-press-time" className="cursor-pointer">
                      <div className="font-medium text-sm font-sans">SOS Button Press Time</div>
                      <div className="text-xs text-muted-foreground font-sans">
                        Hold time required ({settings.safety.sosButtonPressTime} seconds)
                      </div>
                    </Label>
                  </div>
                  <Slider
                    id="sos-press-time"
                    min={1}
                    max={5}
                    step={1}
                    value={[settings.safety.sosButtonPressTime]}
                    onValueChange={handleSOSButtonPressTimeChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1 font-sans">
                    <span>1s</span>
                    <span>3s</span>
                    <span>5s</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div>
              <h3 className="text-base font-medium mb-3 flex items-center font-serif">
                <Lock className="h-4 w-4 mr-2 text-secondary" />
                Account Security
              </h3>
              <div className="space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <Fingerprint className="h-5 w-5 mr-2 text-primary" />
                    <h4 className="font-medium font-sans">Authentication Methods</h4>
                  </div>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-foreground font-sans">
                      <Lock className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-foreground font-sans">
                      <Smartphone className="mr-2 h-4 w-4" /> Two-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-foreground font-sans">
                      <Headphones className="mr-2 h-4 w-4" /> Manage Linked Accounts
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    <h4 className="font-medium font-sans">Security Options</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-notifications" className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm font-sans">Login Notifications</div>
                        <div className="text-xs text-muted-foreground font-sans">
                          Get notified of new logins to your account
                        </div>
                      </Label>
                      <Switch id="login-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="suspicious-activity" className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm font-sans">Suspicious Activity Alerts</div>
                        <div className="text-xs text-muted-foreground font-sans">
                          Get alerts about unusual account activity
                        </div>
                      </Label>
                      <Switch id="suspicious-activity" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

