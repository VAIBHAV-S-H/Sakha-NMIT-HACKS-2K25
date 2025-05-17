"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Bell, Phone, Users, Heart, Trash2, Plus, Save, Smartphone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
}

export function SOSSettings() {
  const [activeTab, setActiveTab] = useState("contacts")
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "Mom", phone: "+91 9876543210", relationship: "Family" },
    { id: "2", name: "Sister", phone: "+91 9876543211", relationship: "Family" },
  ])
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, "id">>({
    name: "",
    phone: "",
    relationship: "",
  })
  const [addingContact, setAddingContact] = useState(false)
  const [settings, setSettings] = useState({
    autoDetectDistress: true,
    sendLocationUpdates: true,
    audioRecording: false,
    healthMonitoring: true,
    vibrateOnActivation: true,
    silentMode: false,
  })

  const { toast } = useToast()

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing information",
        description: "Please provide both name and phone number",
        variant: "destructive",
      })
      return
    }

    const id = `${Date.now()}`
    setEmergencyContacts([...emergencyContacts, { ...newContact, id }])
    setNewContact({ name: "", phone: "", relationship: "" })
    setAddingContact(false)

    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your emergency contacts`,
    })
  }

  const handleDeleteContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter((contact) => contact.id !== id))

    toast({
      title: "Contact removed",
      description: "Emergency contact has been removed",
    })
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your SOS settings have been updated",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-saheli-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-saheli-primary to-saheli-blue-500 text-white">
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            SOS Emergency Settings
          </CardTitle>
          <CardDescription className="text-white/80">
            Configure your emergency contacts and SOS settings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full rounded-none border-b grid grid-cols-3">
              <TabsTrigger
                value="contacts"
                className="data-[state=active]:bg-saheli-pink-100 data-[state=active]:text-saheli-primary"
              >
                <Users className="h-4 w-4 mr-2 hidden sm:inline" />
                Contacts
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="data-[state=active]:bg-saheli-blue-100 data-[state=active]:text-saheli-secondary"
              >
                <Bell className="h-4 w-4 mr-2 hidden sm:inline" />
                Alerts
              </TabsTrigger>
              <TabsTrigger
                value="health"
                className="data-[state=active]:bg-saheli-purple-100 data-[state=active]:text-purple-600"
              >
                <Heart className="h-4 w-4 mr-2 hidden sm:inline" />
                Health
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contacts" className="p-4 sm:p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="text-lg font-medium">Emergency Contacts</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingContact(true)}
                    className="border-saheli-blue-300 text-saheli-blue-500 shadow-sm w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>

                {emergencyContacts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>No emergency contacts added yet</p>
                    <p className="text-sm">Add contacts who should be notified in case of emergency</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {emergencyContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-saheli-blue-200 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-saheli-pink-100 flex items-center justify-center text-saheli-primary font-medium">
                            {contact.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="text-saheli-blue-500">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {addingContact && (
                  <div className="border rounded-lg p-4 space-y-4 bg-saheli-blue-50 border-saheli-blue-200">
                    <h4 className="font-medium">Add New Contact</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Contact name"
                          value={newContact.name}
                          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                          className="border-saheli-blue-300"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="Phone number with country code"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                          className="border-saheli-blue-300"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="relationship">Relationship (Optional)</Label>
                        <Input
                          id="relationship"
                          placeholder="E.g., Family, Friend, Colleague"
                          value={newContact.relationship}
                          onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                          className="border-saheli-blue-300"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAddingContact(false)
                          setNewContact({ name: "", phone: "", relationship: "" })
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddContact}
                        className="bg-gradient-to-r from-saheli-primary to-saheli-blue-500 text-white"
                      >
                        Add Contact
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Alert Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-detect distress</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically detect potential distress based on unusual activity
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoDetectDistress}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoDetectDistress: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Send location updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Send periodic location updates to emergency contacts
                      </p>
                    </div>
                    <Switch
                      checked={settings.sendLocationUpdates}
                      onCheckedChange={(checked) => setSettings({ ...settings, sendLocationUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Audio recording</Label>
                      <p className="text-sm text-muted-foreground">
                        Record audio during emergency and send to contacts
                      </p>
                    </div>
                    <Switch
                      checked={settings.audioRecording}
                      onCheckedChange={(checked) => setSettings({ ...settings, audioRecording: checked })}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-base font-medium mb-3">SOS Trigger Method</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border rounded-lg p-3 bg-saheli-pink-50 border-saheli-pink-200 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-saheli-primary flex items-center justify-center text-white">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Power Button</p>
                        <p className="text-xs text-muted-foreground">Press power button 5 times quickly</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 bg-saheli-blue-50 border-saheli-blue-200 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-saheli-secondary flex items-center justify-center text-white">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">SOS Button</p>
                        <p className="text-xs text-muted-foreground">Press and hold the SOS button in app</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Health Monitoring</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Health monitoring</Label>
                      <p className="text-sm text-muted-foreground">
                        Monitor health metrics to detect potential distress
                      </p>
                    </div>
                    <Switch
                      checked={settings.healthMonitoring}
                      onCheckedChange={(checked) => setSettings({ ...settings, healthMonitoring: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Vibrate on activation</Label>
                      <p className="text-sm text-muted-foreground">Vibrate phone when SOS is activated</p>
                    </div>
                    <Switch
                      checked={settings.vibrateOnActivation}
                      onCheckedChange={(checked) => setSettings({ ...settings, vibrateOnActivation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Silent mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Activate SOS silently without alerting others nearby
                      </p>
                    </div>
                    <Switch
                      checked={settings.silentMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, silentMode: checked })}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-base font-medium mb-3">Connected Devices</h4>
                  <div className="border rounded-lg p-4 bg-saheli-purple-50 border-saheli-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                          <Heart className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Fitness Watch</p>
                          <p className="text-xs text-muted-foreground">Connected • Last sync: 5 mins ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-purple-300 text-purple-600">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t p-4 flex justify-end">
          <Button
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-saheli-primary to-saheli-blue-500 text-white shadow-md w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

