"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone, Bluetooth, Wifi, Battery, Volume2, RefreshCw, Shield } from "lucide-react"

export function DeviceSettings() {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [offlineMode, setOfflineMode] = useState(true)
  const [lowPowerMode, setLowPowerMode] = useState(false)
  const [voiceActivation, setVoiceActivation] = useState(true)
  const [gestureControl, setGestureControl] = useState(true)
  const [updateFrequency, setUpdateFrequency] = useState("15min")

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
        <div className="flex items-center mb-4">
          <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-medium text-blue-800">Connected Device</h3>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">SAHELI Safety Wearable</p>
          <Badge className="bg-green-500">Connected</Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-blue-700">
          <div className="flex items-center">
            <Battery className="h-4 w-4 mr-1" />
            <span>Battery: 78%</span>
          </div>
          <div className="flex items-center">
            <Bluetooth className="h-4 w-4 mr-1" />
            <span>Bluetooth: Active</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Connectivity Settings</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center">
              <Bluetooth className="h-4 w-4 mr-2" />
              <Label className="text-base">Bluetooth Mesh Networking</Label>
            </div>
            <p className="text-sm text-muted-foreground">Enable communication with nearby SAHELI devices</p>
          </div>
          <Switch checked={bluetoothEnabled} onCheckedChange={setBluetoothEnabled} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center">
              <Wifi className="h-4 w-4 mr-2" />
              <Label className="text-base">Offline Emergency Mode</Label>
            </div>
            <p className="text-sm text-muted-foreground">Allow emergency alerts without internet connection</p>
          </div>
          <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center">
              <Battery className="h-4 w-4 mr-2" />
              <Label className="text-base">Low Power Mode</Label>
            </div>
            <p className="text-sm text-muted-foreground">Extend battery life by reducing feature frequency</p>
          </div>
          <Switch checked={lowPowerMode} onCheckedChange={setLowPowerMode} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Activation Settings</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center">
              <Volume2 className="h-4 w-4 mr-2" />
              <Label className="text-base">Voice Activation</Label>
            </div>
            <p className="text-sm text-muted-foreground">Activate SOS with voice commands</p>
          </div>
          <Switch checked={voiceActivation} onCheckedChange={setVoiceActivation} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <Label className="text-base">Gesture Control</Label>
            </div>
            <p className="text-sm text-muted-foreground">Activate SOS with specific gestures</p>
          </div>
          <Switch checked={gestureControl} onCheckedChange={setGestureControl} />
        </div>

        {gestureControl && (
          <div className="ml-6 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Configured Gestures:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Triple tap on device</li>
              <li>• Rapid shake motion</li>
              <li>• Press and hold button for 3 seconds</li>
            </ul>
            <Button variant="link" size="sm" className="px-0 mt-1">
              Customize Gestures
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          <Label>Location Update Frequency</Label>
        </div>
        <Select value={updateFrequency} onValueChange={setUpdateFrequency}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5min">Every 5 minutes</SelectItem>
            <SelectItem value="15min">Every 15 minutes</SelectItem>
            <SelectItem value="30min">Every 30 minutes</SelectItem>
            <SelectItem value="1hr">Every hour</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">More frequent updates improve safety but reduce battery life</p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}

