"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Thermometer, Droplet, Brain, RefreshCw, AlertTriangle } from "lucide-react"
import { db } from "@/lib/db"
import type { HealthData } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export function HealthMonitor({ userId }: { userId: string }) {
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [distressDetected, setDistressDetected] = useState(false)

  const { toast } = useToast()

  // Load health data
  useEffect(() => {
    const loadHealthData = async () => {
      try {
        const data = await db.getHealthData(userId, 1)
        if (data.length > 0) {
          setHealthData(data[0])
          setConnected(true)

          // Check for distress indicators
          const stressLevel = data[0].stressLevel
          const heartRate = data[0].heartRate

          if ((stressLevel && stressLevel > 80) || (heartRate && heartRate > 120)) {
            setDistressDetected(true)
          }
        }
      } catch (error) {
        console.error("Error loading health data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHealthData()

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (connected) {
        // Simulate new health data
        const newHeartRate = Math.floor(Math.random() * 30) + 70 // 70-100 bpm
        const newStressLevel = Math.floor(Math.random() * 40) + 30 // 30-70%

        setHealthData((prev) => {
          if (!prev) return null

          const updated = {
            ...prev,
            heartRate: newHeartRate,
            stressLevel: newStressLevel,
            timestamp: new Date(),
          }

          // Check for distress
          if (newStressLevel > 80 || newHeartRate > 120) {
            setDistressDetected(true)

            toast({
              title: "Potential Distress Detected",
              description: "Unusual vital signs detected. Are you okay?",
              variant: "destructive",
            })
          } else {
            setDistressDetected(false)
          }

          return updated
        })
      }
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [userId, connected, toast])

  const handleConnectDevice = () => {
    // In a real app, this would initiate a Bluetooth connection
    setLoading(true)

    // Simulate connection delay
    setTimeout(() => {
      setConnected(true)
      setHealthData({
        id: `health_${Date.now()}`,
        userId,
        heartRate: 75,
        bloodPressure: {
          systolic: 120,
          diastolic: 80,
        },
        bodyTemperature: 36.6,
        oxygenSaturation: 98,
        stressLevel: 35,
        timestamp: new Date(),
      })

      setLoading(false)

      toast({
        title: "Device Connected",
        description: "Your health monitoring device is now connected",
      })
    }, 2000)
  }

  const handleRefreshData = () => {
    if (!connected) return

    setLoading(true)

    // Simulate refresh delay
    setTimeout(() => {
      setHealthData((prev) => {
        if (!prev) return null

        return {
          ...prev,
          heartRate: Math.floor(Math.random() * 20) + 70,
          stressLevel: Math.floor(Math.random() * 30) + 30,
          timestamp: new Date(),
        }
      })

      setLoading(false)

      toast({
        title: "Data Refreshed",
        description: "Health data has been updated",
      })
    }, 1000)
  }

  const getHeartRateStatus = (rate?: number) => {
    if (!rate) return { color: "text-gray-500", status: "Unknown" }

    if (rate < 60) return { color: "text-blue-500", status: "Low" }
    if (rate > 100) return { color: "text-red-500", status: "High" }
    return { color: "text-green-500", status: "Normal" }
  }

  const getStressStatus = (level?: number) => {
    if (!level) return { color: "text-gray-500", status: "Unknown" }

    if (level < 30) return { color: "text-green-500", status: "Low" }
    if (level > 70) return { color: "text-red-500", status: "High" }
    return { color: "text-yellow-500", status: "Moderate" }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Health Monitoring</CardTitle>
          <CardDescription>Connecting to your device...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saheli-red"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!connected || !healthData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Health Monitoring</CardTitle>
          <CardDescription>Connect your smartwatch or fitness device</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No health monitoring device connected.</p>
            <Button onClick={handleConnectDevice} className="bg-saheli-red hover:bg-saheli-darkred">
              Connect Device
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const heartRateStatus = getHeartRateStatus(healthData.heartRate)
  const stressStatus = getStressStatus(healthData.stressLevel)

  return (
    <Card className={distressDetected ? "border-red-500 animate-pulse" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Health Monitoring</CardTitle>
            <CardDescription>Last updated: {new Date(healthData.timestamp).toLocaleTimeString()}</CardDescription>
          </div>
          {distressDetected && (
            <Badge className="bg-red-500">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Distress Detected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border flex flex-col items-center">
            <Heart className="h-8 w-8 text-saheli-red mb-2" />
            <p className="text-sm text-muted-foreground">Heart Rate</p>
            <p className="text-2xl font-semibold">{healthData.heartRate || "--"}</p>
            <p className="text-xs">BPM</p>
            <Badge variant="outline" className={`mt-1 ${heartRateStatus.color}`}>
              {heartRateStatus.status}
            </Badge>
          </div>

          <div className="p-3 bg-white rounded-lg border flex flex-col items-center">
            <Brain className="h-8 w-8 text-saheli-pink mb-2" />
            <p className="text-sm text-muted-foreground">Stress Level</p>
            <p className="text-2xl font-semibold">{healthData.stressLevel || "--"}</p>
            <p className="text-xs">%</p>
            <Badge variant="outline" className={`mt-1 ${stressStatus.color}`}>
              {stressStatus.status}
            </Badge>
          </div>

          {healthData.bloodPressure && (
            <div className="p-3 bg-white rounded-lg border flex flex-col items-center">
              <Activity className="h-8 w-8 text-saheli-coral mb-2" />
              <p className="text-sm text-muted-foreground">Blood Pressure</p>
              <p className="text-2xl font-semibold">
                {healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}
              </p>
              <p className="text-xs">mmHg</p>
              <Badge variant="outline" className="mt-1 text-green-500">
                Normal
              </Badge>
            </div>
          )}

          {healthData.oxygenSaturation && (
            <div className="p-3 bg-white rounded-lg border flex flex-col items-center">
              <Droplet className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-sm text-muted-foreground">Oxygen Saturation</p>
              <p className="text-2xl font-semibold">{healthData.oxygenSaturation}</p>
              <p className="text-xs">%</p>
              <Badge variant="outline" className="mt-1 text-green-500">
                Normal
              </Badge>
            </div>
          )}

          {healthData.bodyTemperature && (
            <div className="p-3 bg-white rounded-lg border flex flex-col items-center">
              <Thermometer className="h-8 w-8 text-orange-500 mb-2" />
              <p className="text-sm text-muted-foreground">Body Temperature</p>
              <p className="text-2xl font-semibold">{healthData.bodyTemperature}</p>
              <p className="text-xs">°C</p>
              <Badge variant="outline" className="mt-1 text-green-500">
                Normal
              </Badge>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>

          {distressDetected && (
            <Button
              variant="destructive"
              size="sm"
              className="bg-saheli-red hover:bg-saheli-darkred"
              onClick={() => {
                setDistressDetected(false)
                toast({
                  title: "Alert Dismissed",
                  description: "Distress alert has been dismissed",
                })
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Dismiss Alert
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

