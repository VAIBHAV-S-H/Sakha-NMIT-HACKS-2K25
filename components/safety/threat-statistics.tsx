"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, MapPin, Clock, Users, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { ThreatLocation } from "@/lib/types"

export function ThreatStatistics() {
  const [threatLocations, setThreatLocations] = useState<ThreatLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchThreatLocations = async () => {
      try {
        const response = await fetch("/api/threat-locations")
        if (!response.ok) {
          throw new Error("Failed to fetch threat locations")
        }
        const data = await response.json()
        setThreatLocations(data)
      } catch (error) {
        console.error("Error fetching threat locations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchThreatLocations()
  }, [])

  // Calculate statistics
  const totalThreats = threatLocations.length

  const threatsByLevel = {
    high: threatLocations.filter((threat) => threat.threatLevel === "high").length,
    medium: threatLocations.filter((threat) => threat.threatLevel === "medium").length,
    low: threatLocations.filter((threat) => threat.threatLevel === "low").length,
  }

  const threatsByCategory = {
    harassment: threatLocations.filter((threat) => threat.category === "harassment").length,
    theft: threatLocations.filter((threat) => threat.category === "theft").length,
    assault: threatLocations.filter((threat) => threat.category === "assault").length,
    poorLighting: threatLocations.filter((threat) => threat.category === "poorLighting").length,
    isolation: threatLocations.filter((threat) => threat.category === "isolation").length,
    other: threatLocations.filter((threat) => threat.category === "other" || !threat.category).length,
  }

  const verifiedThreats = threatLocations.filter((threat) => threat.verified).length
  const recentThreats = threatLocations.filter(
    (threat) => new Date(threat.reportedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).length

  // Data for the line chart
  const trendData = [
    { date: "Jan", value: 10 },
    { date: "Feb", value: 15 },
    { date: "Mar", value: 12 },
    { date: "Apr", value: 18 },
    { date: "May", value: 16 },
    { date: "Jun", value: 22 },
    { date: "Jul", value: 20 },
    { date: "Aug", value: 25 },
    { date: "Sep", value: 18 },
    { date: "Oct", value: 20 },
    { date: "Nov", value: 22 },
    { date: "Dec", value: 19 },
  ]

  // Find the maximum value for scaling
  const maxValue = Math.max(...trendData.map((item) => item.value))

  return (
    <Card className="shadow-md border-saheli-light dark:border-saheli-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-saheli-primary dark:text-saheli-accent flex items-center font-serif">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Threat Location Statistics
            </CardTitle>
            <CardDescription className="dark:text-saheli-light/70 font-sans">
              Analysis of reported unsafe locations
            </CardDescription>
          </div>
          <div className="bg-saheli-primary/10 dark:bg-saheli-primary/20 rounded-full px-3 py-1 text-saheli-primary dark:text-saheli-accent font-medium text-sm flex items-center font-sans">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {totalThreats} Total Reports
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm font-sans">
              Overview
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-xs sm:text-sm font-sans">
              Categories
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs sm:text-sm font-sans">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-saheli-light/50 dark:bg-saheli-primary/10 rounded-lg p-3 flex flex-col">
                <div className="text-xs text-muted-foreground dark:text-saheli-light/70 mb-1 font-sans">
                  Total Reports
                </div>
                <div className="text-2xl font-bold text-saheli-primary dark:text-saheli-accent font-serif">
                  {totalThreats}
                </div>
              </div>
              <div className="bg-saheli-light/50 dark:bg-saheli-primary/10 rounded-lg p-3 flex flex-col">
                <div className="text-xs text-muted-foreground dark:text-saheli-light/70 mb-1 font-sans">Verified</div>
                <div className="text-2xl font-bold text-saheli-green font-serif">{verifiedThreats}</div>
              </div>
              <div className="bg-saheli-light/50 dark:bg-saheli-primary/10 rounded-lg p-3 flex flex-col">
                <div className="text-xs text-muted-foreground dark:text-saheli-light/70 mb-1 font-sans">
                  Last 7 Days
                </div>
                <div className="text-2xl font-bold text-saheli-orange font-serif">{recentThreats}</div>
              </div>
              <div className="bg-saheli-light/50 dark:bg-saheli-primary/10 rounded-lg p-3 flex flex-col">
                <div className="text-xs text-muted-foreground dark:text-saheli-light/70 mb-1 font-sans">High Risk</div>
                <div className="text-2xl font-bold text-rose-500 font-serif">{threatsByLevel.high}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-saheli-primary dark:text-saheli-accent font-serif">
                Threat Levels
              </h4>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-medium flex items-center">
                      <span className="h-3 w-3 bg-red-500 rounded-full mr-1.5"></span>
                      High Risk
                    </span>
                    <span>
                      {threatsByLevel.high} ({Math.round((threatsByLevel.high / totalThreats) * 100) || 0}%)
                    </span>
                  </div>
                  <Progress
                    value={(threatsByLevel.high / totalThreats) * 100 || 0}
                    className="h-2 bg-saheli-light dark:bg-saheli-primary/20"
                    indicatorClassName="bg-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-medium flex items-center">
                      <span className="h-3 w-3 bg-orange-500 rounded-full mr-1.5"></span>
                      Medium Risk
                    </span>
                    <span>
                      {threatsByLevel.medium} ({Math.round((threatsByLevel.medium / totalThreats) * 100) || 0}%)
                    </span>
                  </div>
                  <Progress
                    value={(threatsByLevel.medium / totalThreats) * 100 || 0}
                    className="h-2 bg-saheli-light dark:bg-saheli-primary/20"
                    indicatorClassName="bg-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-medium flex items-center">
                      <span className="h-3 w-3 bg-teal-500 rounded-full mr-1.5"></span>
                      Low Risk
                    </span>
                    <span>
                      {threatsByLevel.low} ({Math.round((threatsByLevel.low / totalThreats) * 100) || 0}%)
                    </span>
                  </div>
                  <Progress
                    value={(threatsByLevel.low / totalThreats) * 100 || 0}
                    className="h-2 bg-saheli-light dark:bg-saheli-primary/20"
                    indicatorClassName="bg-teal-500"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-saheli-primary dark:text-saheli-accent font-serif">
                Threat Categories
              </h4>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-medium">Harassment</span>
                    <span>
                      {threatsByCategory.harassment} (
                      {Math.round((threatsByCategory.harassment / totalThreats) * 100) || 0}%)
                    </span>
                  </div>
                  <Progress
                    value={(threatsByCategory.harassment / totalThreats) * 100 || 0}
                    className="h-2 bg-saheli-light dark:bg-saheli-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-medium">Theft</span>
                    <span>
                      {threatsByCategory.theft} ({Math.round((threatsByCategory.theft / totalThreats) * 100) || 0}%)
                    </span>
                  </div>
                  <Progress
                    value={(threatsByCategory.theft / totalThreats) * 100 || 0}
                    className="h-2 bg-saheli-light dark:bg-saheli-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-medium">Assault</span>
                    <span>
                      {threatsByCategory.assault} ({Math.round((threatsByCategory.assault / totalThreats) * 100) || 0}%)
                    </span>
                  </div>
                  <Progress
                    value={(threatsByCategory.assault / totalThreats) * 100 || 0}
                    className="h-2 bg-saheli-light dark:bg-saheli-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-medium">Poor Lighting</span>
                    <span>
                      {threatsByCategory.poorLighting} (
                      {Math.round((threatsByCategory.poorLighting / totalThreats) * 100) || 0}%)
                    </span>
                  </div>
                  <Progress
                    value={(threatsByCategory.poorLighting / totalThreats) * 100 || 0}
                    className="h-2 bg-saheli-light dark:bg-saheli-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-medium">Isolation</span>
                    <span>
                      {threatsByCategory.isolation} (
                      {Math.round((threatsByCategory.isolation / totalThreats) * 100) || 0}%)
                    </span>
                  </div>
                  <Progress
                    value={(threatsByCategory.isolation / totalThreats) * 100 || 0}
                    className="h-2 bg-saheli-light dark:bg-saheli-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-medium">Other</span>
                    <span>
                      {threatsByCategory.other} ({Math.round((threatsByCategory.other / totalThreats) * 100) || 0}%)
                    </span>
                  </div>
                  <Progress
                    value={(threatsByCategory.other / totalThreats) * 100 || 0}
                    className="h-2 bg-saheli-light dark:bg-saheli-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-saheli-light/50 dark:bg-saheli-primary/10 rounded-lg p-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-saheli-primary/20 flex items-center justify-center mr-3">
                  <MapPin className="h-4 w-4 text-saheli-primary dark:text-saheli-accent" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground dark:text-saheli-light/70 font-sans">
                    Most Reported Area
                  </div>
                  <div className="text-sm font-medium font-sans">Downtown</div>
                </div>
              </div>
              <div className="bg-saheli-light/50 dark:bg-saheli-primary/10 rounded-lg p-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-saheli-primary/20 flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-saheli-primary dark:text-saheli-accent" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground dark:text-saheli-light/70 font-sans">
                    Most Reported Time
                  </div>
                  <div className="text-sm font-medium font-sans">9PM - 12AM</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-saheli-primary dark:text-saheli-accent flex items-center font-serif">
                <TrendingUp className="h-4 w-4 mr-1.5" />
                Monthly Trend
              </h4>

              {/* Custom Line Chart Implementation */}
              <div className="h-60 w-full bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="h-full flex items-end justify-between relative">
                  {/* Y-axis line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>

                  {/* X-axis line */}
                  <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200 dark:bg-gray-700"></div>

                  {/* Chart bars */}
                  {trendData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center group relative" style={{ height: "100%" }}>
                      <div
                        className="bg-rose-500 w-6 rounded-t-sm transition-all duration-300 hover:bg-rose-400"
                        style={{ height: `${(item.value / maxValue) * 80}%`, marginTop: "auto" }}
                      ></div>
                      <div className="text-xs mt-1 text-gray-600 dark:text-gray-300">{item.date}</div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-900 shadow-md rounded-md p-2 text-xs pointer-events-none">
                        <div className="font-medium">{item.date}</div>
                        <div className="text-rose-500">{item.value} reports</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-saheli-light/50 dark:bg-saheli-primary/10 rounded-lg p-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-saheli-primary/20 flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-saheli-primary dark:text-saheli-accent" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground dark:text-saheli-light/70 font-sans">
                    Community Reports
                  </div>
                  <div className="text-sm font-medium font-sans">67 Active Contributors</div>
                </div>
              </div>
              <div className="bg-saheli-light/50 dark:bg-saheli-primary/10 rounded-lg p-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-saheli-primary/20 flex items-center justify-center mr-3">
                  <Shield className="h-4 w-4 text-saheli-primary dark:text-saheli-accent" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground dark:text-saheli-light/70 font-sans">Safety Score</div>
                  <div className="text-sm font-medium font-sans">78/100 (Improving)</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

