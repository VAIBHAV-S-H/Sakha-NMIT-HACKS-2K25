"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MapPin, Clock, Info } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ThreatLocation {
  _id: string
  name: string
  description: string
  latitude: number
  longitude: number
  threatLevel: "high" | "medium" | "low"
  reportedAt: string
  reportCount: number
  votes: number
}

export function ThreatLocations() {
  const [threats, setThreats] = useState<ThreatLocation[]>([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchThreatLocations = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/threat-locations')
        if (!response.ok) {
          throw new Error('Failed to fetch threat locations')
        }
        const data = await response.json()
        setThreats(data)
      } catch (err) {
        console.error('Error fetching threat locations:', err)
        setError('Failed to load threat locations')
      } finally {
        setLoading(false)
      }
    }
    
    fetchThreatLocations()
  }, [])

  const filteredThreats = filter === "all" ? threats : threats.filter((threat) => threat.threatLevel === filter)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Threat Locations</CardTitle>
            <CardDescription>Areas reported as unsafe by the community</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "bg-saheli-rose hover:bg-saheli-rose/90 text-white"
                  : "text-foreground hover:bg-muted"
              }
            >
              All
            </Button>
            <Button
              variant={filter === "high" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("high")}
              className={
                filter === "high"
                  ? "bg-saheli-danger hover:bg-saheli-danger/90 text-white"
                  : "text-foreground hover:bg-muted"
              }
            >
              High
            </Button>
            <Button
              variant={filter === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("medium")}
              className={
                filter === "medium"
                  ? "bg-saheli-warning hover:bg-saheli-warning/90 text-white"
                  : "text-foreground hover:bg-muted"
              }
            >
              Medium
            </Button>
            <Button
              variant={filter === "low" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("low")}
              className={
                filter === "low"
                  ? "bg-saheli-info hover:bg-saheli-info/90 text-white"
                  : "text-foreground hover:bg-muted"
              }
            >
              Low
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px] pr-4">
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-saheli-rose mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading threat locations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <AlertCircle className="h-10 w-10 text-saheli-danger mx-auto mb-2" />
              <p className="text-saheli-danger">{error}</p>
            </div>
          ) : filteredThreats.length === 0 ? (
            <div className="text-center py-6">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No threat locations found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredThreats.map((threat) => (
                <div key={threat._id} className="p-3 rounded-md bg-muted/50 hover:bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <MapPin
                        className={`h-4 w-4 mr-2 ${
                          threat.threatLevel === "high"
                            ? "text-saheli-danger"
                            : threat.threatLevel === "medium"
                              ? "text-saheli-warning"
                              : "text-saheli-info"
                        }`}
                      />
                      <span className="font-medium text-sm">{threat.name}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`
                        ${
                          threat.threatLevel === "high"
                            ? "border-saheli-danger text-saheli-danger bg-saheli-danger/10"
                            : threat.threatLevel === "medium"
                              ? "border-saheli-warning text-saheli-warning bg-saheli-warning/10"
                              : "border-saheli-info text-saheli-info bg-saheli-info/10"
                        }
                      `}
                    >
                      {threat.threatLevel} risk
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{threat.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTimestamp(threat.reportedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>{threat.reportCount} reports</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

