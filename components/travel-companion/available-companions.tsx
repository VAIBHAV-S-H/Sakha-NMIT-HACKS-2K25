"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Shield, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

// Mock data for available companions
const mockCompanions = [
  {
    id: "1",
    name: "Priya Sharma",
    rating: 4.8,
    reviews: 24,
    location: "Indiranagar, Bangalore",
    distance: "1.2 km away",
    availability: "Available now",
    verificationStatus: "Verified",
    bio: "Software engineer who commutes daily to work. Happy to accompany fellow women for safety.",
    languages: ["English", "Hindi", "Kannada"],
    interests: ["Reading", "Hiking", "Photography"],
    profileImage: "/placeholder.svg?height=80&width=80",
    safetyScore: 98,
    commonConnections: 3,
    travelPreferences: {
      transportModes: ["Walking", "Metro", "Cab"],
      timePreference: "Morning/Evening",
      routePreference: "Well-lit areas only",
    },
  },
  {
    id: "2",
    name: "Ananya Desai",
    rating: 4.6,
    reviews: 18,
    location: "Koramangala, Bangalore",
    distance: "2.5 km away",
    availability: "Available after 6 PM",
    verificationStatus: "Verified",
    bio: "College student studying at BMS College. Looking for travel companions for evening commutes.",
    languages: ["English", "Hindi", "Marathi"],
    interests: ["Music", "Dance", "Movies"],
    profileImage: "/placeholder.svg?height=80&width=80",
    safetyScore: 95,
    commonConnections: 1,
    travelPreferences: {
      transportModes: ["Auto", "Metro"],
      timePreference: "Evening only",
      routePreference: "Main roads",
    },
  },
  {
    id: "3",
    name: "Meera Patel",
    rating: 4.9,
    reviews: 32,
    location: "HSR Layout, Bangalore",
    distance: "3.8 km away",
    availability: "Available weekends",
    verificationStatus: "Verified",
    bio: "IT professional working at Infosys. Regular commuter looking for travel buddies.",
    languages: ["English", "Hindi", "Gujarati"],
    interests: ["Yoga", "Cooking", "Travel"],
    profileImage: "/placeholder.svg?height=80&width=80",
    safetyScore: 99,
    commonConnections: 5,
    travelPreferences: {
      transportModes: ["Car", "Metro", "Cab"],
      timePreference: "Flexible",
      routePreference: "Safest route",
    },
  },
]

export function AvailableCompanions() {
  const router = useRouter()
  const [companions] = useState(mockCompanions)
  const [selectedCompanion, setSelectedCompanion] = useState<any>(null)

  const handleAcceptRide = (companionId: string) => {
    // In a real app, this would send a request to the backend
    // For now, we'll just navigate to the chat window
    router.push(`/dashboard/travel-companion/chat?id=${companionId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Available Companions</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companions.map((companion) => (
          <Card key={companion.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage src={companion.profileImage} alt={companion.name} />
                    <AvatarFallback>{companion.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{companion.name}</CardTitle>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm font-medium">{companion.rating}</span>
                      <span className="ml-1 text-xs text-muted-foreground">({companion.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  {companion.verificationStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p>{companion.location}</p>
                    <p className="text-xs text-muted-foreground">{companion.distance}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{companion.availability}</p>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>
                    Safety Score:{" "}
                    <span className="font-medium text-green-600 dark:text-green-400">{companion.safetyScore}%</span>
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm line-clamp-2">{companion.bio}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedCompanion(companion)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Companion Profile</DialogTitle>
                    <DialogDescription>Review detailed information about this travel companion</DialogDescription>
                  </DialogHeader>
                  {selectedCompanion && (
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16 border-2 border-primary">
                          <AvatarImage src={selectedCompanion.profileImage} alt={selectedCompanion.name} />
                          <AvatarFallback>{selectedCompanion.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold">{selectedCompanion.name}</h3>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="ml-1 text-sm font-medium">{selectedCompanion.rating}</span>
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({selectedCompanion.reviews} reviews)
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="mt-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          >
                            {selectedCompanion.verificationStatus}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">About</h4>
                        <p>{selectedCompanion.bio}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold">Languages</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedCompanion.languages.map((lang: string) => (
                              <Badge key={lang} variant="secondary" className="mr-1 mt-1">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold">Interests</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedCompanion.interests.map((interest: string) => (
                              <Badge key={interest} variant="outline" className="mr-1 mt-1">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold">Travel Preferences</h4>
                        <div className="mt-2 space-y-2 text-sm">
                          <div className="flex items-start">
                            <span className="font-medium mr-2">Transport:</span>
                            <span>{selectedCompanion.travelPreferences.transportModes.join(", ")}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-medium mr-2">Time:</span>
                            <span>{selectedCompanion.travelPreferences.timePreference}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-medium mr-2">Route:</span>
                            <span>{selectedCompanion.travelPreferences.routePreference}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {selectedCompanion.commonConnections} mutual connections
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              onClick={() => handleAcceptRide(selectedCompanion.id)}
                              className="flex items-center"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Connect
                            </Button>
                          </DialogClose>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button className="w-full" onClick={() => handleAcceptRide(companion.id)}>
                Accept Ride
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

