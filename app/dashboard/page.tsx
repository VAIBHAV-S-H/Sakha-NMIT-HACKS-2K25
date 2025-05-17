"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SafetyStatus } from "@/components/dashboard/safety-status"
import { UpcomingRides } from "@/components/dashboard/upcoming-rides"
import { SafetyMap } from "@/components/dashboard/safety-map"
import { EmergencyContacts } from "@/components/dashboard/emergency-contacts"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { auth } from "@/lib/auth"
import { SOSButton } from "@/components/safety/sos-button"

export default function DashboardPage() {
  // Get current user
  const currentUser = auth.getCurrentUser()

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />

        <main className="flex-1 container px-4 py-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <SafetyStatus />

            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Rides</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <CardDescription>Your scheduled travel companion requests</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingRides />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="map" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="map">Safety Map</TabsTrigger>
              <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
              <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Safety Map</CardTitle>
                  <CardDescription>View safe routes and areas based on community data</CardDescription>
                </CardHeader>
                <CardContent>
                  <SafetyMap />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>People who will be notified in case of an emergency</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmergencyContacts />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>History of your safety alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentAlerts />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Safety Tips</CardTitle>
                <CardDescription>Recommendations to enhance your safety</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Share your travel plans</p>
                      <p className="text-sm text-muted-foreground">
                        Let trusted contacts know your itinerary before traveling
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Stay in well-lit areas</p>
                      <p className="text-sm text-muted-foreground">
                        Avoid poorly lit streets and shortcuts through isolated areas
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Keep your device charged</p>
                      <p className="text-sm text-muted-foreground">
                        Ensure your SAHELI device has sufficient battery for emergencies
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Updates</CardTitle>
                <CardDescription>Latest news from the SAHELI community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">New Safety Feature Released</h4>
                      <Badge variant="outline">New</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Voice-activated SOS is now available in the latest app update
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Community Meetup</h4>
                      <Badge variant="outline">Event</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Join us for a safety workshop this Saturday at 10 AM
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Expanded Coverage Area</h4>
                      <Badge variant="outline">Update</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      SAHELI now available in 5 new cities across the country
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        {/* SOS Button */}
        <SOSButton />
      </div>
    </ProtectedRoute>
  )
}

