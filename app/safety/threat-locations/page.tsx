import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  MapPin,
  Search,
  Filter,
  Map,
  List,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Clock,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function ThreatLocationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1">
        <div className="container py-6 md:py-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Threat Locations</h1>
              <p className="text-muted-foreground mt-1">View and report unsafe locations in your community</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link href="/safety" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-saheli-blue-300 text-saheli-blue-500 shadow-sm"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Safety Features
                </Button>
              </Link>
              <Link href="/safety/map" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-saheli-primary hover:bg-saheli-primary/90 text-white shadow-md">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Location
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-saheli-primary" />
                  <Input
                    type="text"
                    placeholder="Search threat locations..."
                    className="pl-9 border-saheli-blue-300 focus:border-saheli-blue-500"
                  />
                </div>
                <Button variant="outline" className="bg-white hover:bg-gray-50 shadow-sm border-saheli-blue-300">
                  <Filter className="h-4 w-4 mr-2 text-saheli-primary" />
                  Filter
                </Button>
              </div>

              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-saheli-blue-100">
                  <TabsTrigger
                    value="list"
                    className="data-[state=active]:bg-saheli-blue-500 data-[state=active]:text-white"
                  >
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </TabsTrigger>
                  <TabsTrigger
                    value="map"
                    className="data-[state=active]:bg-saheli-primary data-[state=active]:text-white"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Map View
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="mt-4 space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Card key={item} className="border-saheli-blue-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-bold text-saheli-primary">
                            Dark Alley near Main Street
                          </CardTitle>
                          <Badge className="bg-red-500 text-white">High Risk</Badge>
                        </div>
                        <CardDescription className="flex items-center text-sm">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-saheli-primary" />
                          2.5 km from your location
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-700">
                          Poorly lit area with multiple reports of harassment. No security cameras and isolated after 8
                          PM.
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge
                            variant="outline"
                            className="text-xs bg-saheli-blue-50 border-saheli-blue-200 text-saheli-blue-700"
                          >
                            Poor Lighting
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-saheli-blue-50 border-saheli-blue-200 text-saheli-blue-700"
                          >
                            Harassment
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-saheli-blue-50 border-saheli-blue-200 text-saheli-blue-700"
                          >
                            Isolation
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center pt-2 border-t text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Reported: 2 days ago
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Unsafe at: Night
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600">
                            <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                            <span>12</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                            <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                            <span>2</span>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="map" className="mt-4">
                  <div className="aspect-video md:aspect-auto md:h-[600px] bg-slate-100 rounded-lg overflow-hidden shadow-sm relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">Map view loading...</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="col-span-1 space-y-4">
              <Card className="border-saheli-blue-200 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-saheli-primary to-saheli-blue-500 text-white">
                  <CardTitle className="text-lg font-bold">Safety Statistics</CardTitle>
                  <CardDescription className="text-white/80">Community safety insights</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Reports</span>
                      <span className="font-medium">127</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Verified Locations</span>
                      <span className="font-medium">98</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">High Risk Areas</span>
                      <span className="font-medium text-red-600">32</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Medium Risk Areas</span>
                      <span className="font-medium text-amber-600">45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Low Risk Areas</span>
                      <span className="font-medium text-blue-600">50</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="font-medium mb-2">Most Reported Issues</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Poor Lighting</span>
                        <span className="font-medium">42%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Harassment</span>
                        <span className="font-medium">28%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Isolation</span>
                        <span className="font-medium">18%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Theft</span>
                        <span className="font-medium">12%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full bg-gradient-to-r from-saheli-blue-500 to-saheli-primary text-white shadow-md">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report New Location
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-saheli-blue-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Safety Tips</CardTitle>
                  <CardDescription>Stay safe in high-risk areas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-saheli-pink-100 flex items-center justify-center text-saheli-primary flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm">
                      Share your location with trusted contacts when traveling through high-risk areas
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-saheli-blue-100 flex items-center justify-center text-saheli-blue-500 flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm">Avoid poorly lit areas after dark and stick to main roads when possible</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-saheli-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm">Use the SAHELI SOS feature for quick emergency assistance</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

