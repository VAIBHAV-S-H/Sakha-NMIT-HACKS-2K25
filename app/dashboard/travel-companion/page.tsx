"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MapPin, Calendar, Car, Bus, Train, Bike, User, Users, Info } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AvailableCompanions } from "@/components/travel-companion/available-companions"
import { CreateTravelRequestForm } from "@/components/travel-companion/create-travel-request-form"
import { MyTravelRequests } from "@/components/travel-companion/my-travel-requests"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TravelMode } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function TravelCompanionPage() {
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [date, setDate] = useState("")
  const [travelMode, setTravelMode] = useState<TravelMode>("car")
  const [activeTab, setActiveTab] = useState("find")

  const searchParams = useSearchParams()

  // Set active tab from URL query parameter if available
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["find", "create", "my-requests"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />

        <main className="flex-1 container px-4 py-8 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Travel Companion</h1>
            <p className="text-muted-foreground">Find trusted travel companions for any mode of transportation</p>
          </div>

          <Card className="mb-8 border-saheli-lightyellow bg-saheli-lightyellow/30 dark:bg-saheli-twilight/30 dark:border-saheli-twilight">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-saheli-brightyellow mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-lg mb-2">About Travel Companions</h3>
                  <p className="text-muted-foreground mb-2">
                    Our Travel Companion system helps you find trusted companions for any mode of travel:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                    <li className="flex items-center">
                      <Car className="h-4 w-4 mr-2 text-saheli-brightred" />
                      <span>
                        <strong>Car/Bike:</strong> Travel together for safety
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Bus className="h-4 w-4 mr-2 text-saheli-brightgreen" />
                      <span>
                        <strong>Bus/Train:</strong> Find companions on public transit
                      </span>
                    </li>
                    <li className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-saheli-brightyellow" />
                      <span>
                        <strong>Walking Buddy:</strong> Always free, added safety
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-saheli-brightgreen" />
                      <span>
                        <strong>All modes:</strong> Verified companions for safety
                      </span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Travel with peace of mind knowing you're accompanied by verified women from the SAHELI community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="find">Find Companions</TabsTrigger>
              <TabsTrigger value="create">Create Request</TabsTrigger>
              <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="find">
              <Card>
                <CardHeader>
                  <CardTitle>Find Travel Companions</CardTitle>
                  <CardDescription>Search for available travel companions matching your route</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="From"
                        className="pl-9"
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="To"
                        className="pl-9"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="date" className="pl-9" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="relative">
                      <Select value={travelMode} onValueChange={(value) => setTravelMode(value as TravelMode)}>
                        <SelectTrigger className="pl-9">
                          <Car className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Travel mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car">
                            <div className="flex items-center">
                              <Car className="h-4 w-4 mr-2 text-saheli-brightred" />
                              <span>Car</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="bus">
                            <div className="flex items-center">
                              <Bus className="h-4 w-4 mr-2 text-saheli-brightgreen" />
                              <span>Bus (Public Transit)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="train">
                            <div className="flex items-center">
                              <Train className="h-4 w-4 mr-2 text-saheli-brightgreen" />
                              <span>Train (Public Transit)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="walk">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-saheli-brightyellow" />
                              <span>Walking Buddy</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="bike">
                            <div className="flex items-center">
                              <Bike className="h-4 w-4 mr-2 text-saheli-brightred" />
                              <span>Bike</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="mb-8 bg-saheli-brightred hover:bg-saheli-red">
                    <Search className="mr-2 h-4 w-4" />
                    Search Companions
                  </Button>

                  <AvailableCompanions />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create Travel Request</CardTitle>
                  <CardDescription>Find a companion or offer to accompany others on their journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateTravelRequestForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-requests">
              <Card>
                <CardHeader>
                  <CardTitle>My Travel Requests</CardTitle>
                  <CardDescription>Manage your upcoming and past travel requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <MyTravelRequests />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Travel Safety Guidelines</CardTitle>
              <CardDescription>Follow these guidelines for a safe travel experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-background">
                  <div className="bg-saheli-coral/20 p-3 rounded-full mb-4">
                    <Users className="h-6 w-6 text-saheli-red" />
                  </div>
                  <h3 className="font-medium mb-2">Verify Profiles</h3>
                  <p className="text-sm text-muted-foreground">
                    Always check companion verification badges before confirming a journey
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-background">
                  <div className="bg-saheli-coral/20 p-3 rounded-full mb-4">
                    <MapPin className="h-6 w-6 text-saheli-red" />
                  </div>
                  <h3 className="font-medium mb-2">Share Your Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable location sharing with emergency contacts during your journey
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-background">
                  <div className="bg-saheli-coral/20 p-3 rounded-full mb-4">
                    <Car className="h-6 w-6 text-saheli-red" />
                  </div>
                  <h3 className="font-medium mb-2">Meet in Public Places</h3>
                  <p className="text-sm text-muted-foreground">Always arrange meetups at well-lit, public locations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}

