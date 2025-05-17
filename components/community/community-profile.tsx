"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Star,
  MapPin,
  Calendar,
  MessageSquare,
  UserPlus,
  Shield,
  Award,
  ThumbsUp,
  Car,
  Bus,
  Train,
  Bike,
  UserIcon,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ChatWindow } from "@/components/travel-companion/chat-window"

interface CommunityProfileProps {
  userId: string
  onClose?: () => void
}

export function CommunityProfile({ userId, onClose }: CommunityProfileProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [showChat, setShowChat] = useState(false)

  // Mock user data - in a real app, this would come from an API
  const user = {
    id: userId,
    name: "Anjali Sharma",
    avatar: "/placeholder.svg?height=100&width=100&text=AS",
    location: "Bangalore, Karnataka",
    bio: "Software engineer by day, avid traveler by weekend. I love exploring new places and meeting new people. Safety advocate and volunteer at local women's shelter.",
    memberSince: "March 2023",
    verified: true,
    safetyScore: 98,
    rating: 4.8,
    reviews: 42,
    badges: [
      { name: "Safety Champion", icon: <Shield className="h-4 w-4" /> },
      { name: "Trusted Traveler", icon: <Award className="h-4 w-4" /> },
      { name: "Community Guide", icon: <MapPin className="h-4 w-4" /> },
    ],
    travelPreferences: [
      { mode: "car", count: 28 },
      { mode: "train", count: 12 },
      { mode: "walk", count: 8 },
    ],
    recentTrips: [
      { from: "Indiranagar", to: "Electronic City", date: "Last week", mode: "car" },
      { from: "Koramangala", to: "Whitefield", date: "2 weeks ago", mode: "car" },
      { from: "HSR Layout", to: "MG Road", date: "Last month", mode: "walk" },
    ],
    reviews: [
      {
        id: "rev1",
        user: {
          name: "Priya Mehta",
          avatar: "/placeholder.svg?height=40&width=40&text=PM",
        },
        rating: 5,
        text: "Anjali was a great travel companion! Very punctual and made me feel safe throughout the journey.",
        date: "2 weeks ago",
      },
      {
        id: "rev2",
        user: {
          name: "Meera Singh",
          avatar: "/placeholder.svg?height=40&width=40&text=MS",
        },
        rating: 5,
        text: "Had a wonderful experience carpooling with Anjali. Her car was clean and she's a safe driver.",
        date: "1 month ago",
      },
      {
        id: "rev3",
        user: {
          name: "Kavita Reddy",
          avatar: "/placeholder.svg?height=40&width=40&text=KR",
        },
        rating: 4,
        text: "Great walking buddy! We had interesting conversations and she knows the safest routes.",
        date: "2 months ago",
      },
    ],
  }

  const handleConnect = async () => {
    setLoading(true)

    try {
      // In a real app, this would call an API to send a connection request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setConnected(true)
      toast({
        title: "Connection request sent",
        description: `Your connection request has been sent to ${user.name}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartChat = () => {
    setShowChat(true)
  }

  const getTravelModeIcon = (mode: string) => {
    switch (mode) {
      case "car":
        return <Car className="h-4 w-4 text-saheli-rose" />
      case "bus":
        return <Bus className="h-4 w-4 text-saheli-dusk" />
      case "train":
        return <Train className="h-4 w-4 text-saheli-dusk" />
      case "bike":
        return <Bike className="h-4 w-4 text-saheli-rose" />
      case "walk":
        return <UserIcon className="h-4 w-4 text-saheli-sunset" />
      default:
        return <Car className="h-4 w-4 text-saheli-rose" />
    }
  }

  if (showChat) {
    return (
      <div className="h-[70vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chat with {user.name}</h2>
          <Button variant="outline" onClick={() => setShowChat(false)}>
            Back to Profile
          </Button>
        </div>
        <ChatWindow companionId={user.id} companionName={user.name} companionAvatar={user.avatar} />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {onClose && (
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={onClose}>
            Close Profile
          </Button>
        </div>
      )}

      <div className="bg-white dark:bg-saheli-twilight rounded-lg shadow-lg overflow-hidden">
        {/* Profile header */}
        <div className="bg-gradient-to-r from-saheli-rose to-saheli-sunset p-6 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.verified && (
                  <Badge className="bg-white/20 text-white self-center md:self-auto">
                    <Shield className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-start mt-1 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{user.location}</span>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="flex items-center bg-white/10 rounded-full px-3 py-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-300 mr-1" />
                  <span>
                    {user.rating} ({user.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center bg-white/10 rounded-full px-3 py-1 text-sm">
                  <Shield className="h-4 w-4 text-saheli-duskLight mr-1" />
                  <span>Safety Score: {user.safetyScore}%</span>
                </div>

                <div className="flex items-center bg-white/10 rounded-full px-3 py-1 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Member since {user.memberSince}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              <Button
                className={
                  connected ? "bg-saheli-dusk hover:bg-saheli-duskDark" : "bg-saheli-rose hover:bg-saheli-roseDark"
                }
                onClick={connected ? handleStartChat : handleConnect}
                disabled={loading}
              >
                {connected ? (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </>
                ) : loading ? (
                  "Connecting..."
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>

              {connected && (
                <Button variant="outline" className="border-white text-white hover:bg-white/20">
                  View Travel History
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile content */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-muted-foreground">{user.bio}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1 py-1">
                      {badge.icon}
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Travel Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.travelPreferences.map((pref, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getTravelModeIcon(pref.mode)}
                        <span className="ml-2 capitalize">{pref.mode}</span>
                      </div>
                      <Badge variant="outline">{pref.count} trips</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recent Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.recentTrips.map((trip, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center">
                        {getTravelModeIcon(trip.mode)}
                        <span className="ml-2 font-medium">
                          {trip.from} to {trip.to}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">{trip.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="reviews">
            <TabsList className="mb-4">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="safety">Safety Information</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              {user.reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={review.user.avatar} alt={review.user.name} />
                        <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{review.text}</p>
                  <div className="mt-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="safety">
              <Card>
                <CardHeader>
                  <CardTitle>Safety Verification</CardTitle>
                  <CardDescription>Information about {user.name}'s safety credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-saheli-duskLight/10 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-saheli-dusk mr-2" />
                      <span>ID Verification</span>
                    </div>
                    <Badge className="bg-saheli-dusk">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-saheli-duskLight/10 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-saheli-dusk mr-2" />
                      <span>Phone Verification</span>
                    </div>
                    <Badge className="bg-saheli-dusk">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-saheli-duskLight/10 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-saheli-dusk mr-2" />
                      <span>Email Verification</span>
                    </div>
                    <Badge className="bg-saheli-dusk">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-saheli-duskLight/10 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-saheli-dusk mr-2" />
                      <span>Background Check</span>
                    </div>
                    <Badge className="bg-saheli-dusk">Completed</Badge>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      SAHELI verifies user information to ensure a safe community. All verifications are conducted by
                      trusted third-party providers and updated regularly.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Learn More About Our Safety Measures
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

