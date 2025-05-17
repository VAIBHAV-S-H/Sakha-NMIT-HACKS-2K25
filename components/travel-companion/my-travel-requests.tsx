"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Plus, User, Users, Car, Bus, Train, Bike, UserIcon, Loader2 } from "lucide-react"
import type { TravelMode, RequestStatus } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/lib/auth"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"

// Helper function to get the appropriate icon for travel mode
const getTravelModeIcon = (mode: TravelMode | string) => {
  switch (mode) {
    case "car":
      return <Car className="h-4 w-4 mr-1 text-saheli-brightred" />
    case "bus":
      return <Bus className="h-4 w-4 mr-1 text-saheli-brightgreen" />
    case "train":
      return <Train className="h-4 w-4 mr-1 text-saheli-brightgreen" />
    case "bike":
      return <Bike className="h-4 w-4 mr-1 text-saheli-brightred" />
    case "walk":
      return <UserIcon className="h-4 w-4 mr-1 text-saheli-brightyellow" />
    default:
      return <Car className="h-4 w-4 mr-1 text-saheli-brightred" />
  }
}

// Helper function to check if a travel mode is private
const isPrivateTransport = (mode: TravelMode | string) => {
  return mode === "car" || mode === "bike"
}

// Mock data for travel requests
const mockRequests = [
  {
    id: "1",
    title: "Evening commute from office",
    from: "Manyata Tech Park, Bangalore",
    to: "Koramangala 5th Block, Bangalore",
    date: "Today",
    time: "6:30 PM",
    status: "Active",
    responses: 2,
    travelMode: "cab",
  },
  {
    id: "2",
    title: "Weekend shopping trip",
    from: "HSR Layout, Bangalore",
    to: "Phoenix Marketcity, Whitefield",
    date: "Saturday, Apr 3",
    time: "11:00 AM",
    status: "Scheduled",
    responses: 1,
    travelMode: "car",
  },
  {
    id: "3",
    title: "Late night return from event",
    from: "Palace Grounds, Bangalore",
    to: "Indiranagar, Bangalore",
    date: "Friday, Apr 9",
    time: "10:30 PM",
    status: "Pending",
    responses: 0,
    travelMode: "walk",
  },
]

export function MyTravelRequests() {
  const router = useRouter()
  const [requests, setRequests] = useState(mockRequests)
  const [isCreatingRequest, setIsCreatingRequest] = useState(false)
  const [newRequest, setNewRequest] = useState({
    title: "",
    from: "",
    to: "",
    date: "",
    time: "",
    description: "",
    transportMode: "any",
  })
  const [upcomingRequests, setUpcomingRequests] = useState<any[]>([])
  const [pastRequests, setPastRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [requestToCancel, setRequestToCancel] = useState<any | null>(null)
  const [rateDialogOpen, setRateDialogOpen] = useState(false)
  const [requestToRate, setRequestToRate] = useState<any | null>(null)
  const [rating, setRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const loadRequests = async () => {
      const currentUser = auth.getCurrentUser()
      if (!currentUser) {
        setLoading(false)
        return
      }

      try {
        // In a real app, this would fetch from the database
        // For demo purposes, we'll use mock data

        // Mock data - in a real app, this would come from an API
        const upcomingMock = [
          {
            id: 1,
            type: "Passenger",
            requestType: "request", // I requested a ride
            from: "Indiranagar",
            to: "Electronic City",
            date: "Tomorrow",
            time: "9:00 AM",
            price: "₹120",
            status: "active" as RequestStatus,
            travelMode: "car" as TravelMode,
            companion: {
              name: "Anjali Sharma",
              avatar: "/placeholder.svg?height=40&width=40",
            },
          },
          {
            id: 2,
            type: "Driver",
            requestType: "offer", // I offered a ride
            from: "Koramangala",
            to: "Whitefield",
            date: "Friday",
            time: "8:30 AM",
            price: "₹150",
            status: "active" as RequestStatus,
            travelMode: "car" as TravelMode,
            passengers: 2,
          },
          {
            id: 3,
            type: "Passenger",
            requestType: "request", // I requested a ride
            from: "HSR Layout",
            to: "MG Road",
            date: "Saturday",
            time: "10:15 AM",
            status: "active" as RequestStatus,
            travelMode: "walk" as TravelMode,
            companion: {
              name: "Meera Patel",
              avatar: "/placeholder.svg?height=40&width=40",
            },
          },
        ]

        const pastMock = [
          {
            id: 4,
            type: "Passenger",
            requestType: "request", // I requested a ride
            from: "HSR Layout",
            to: "MG Road",
            date: "Monday",
            time: "9:15 AM",
            travelMode: "bus" as TravelMode,
            status: "completed" as RequestStatus,
            companion: {
              name: "Kavita Reddy",
              avatar: "/placeholder.svg?height=40&width=40",
            },
          },
          {
            id: 5,
            type: "Driver",
            requestType: "offer", // I offered a ride
            from: "JP Nagar",
            to: "Marathahalli",
            date: "Last Week",
            time: "6:30 PM",
            price: "₹180",
            travelMode: "car" as TravelMode,
            status: "completed" as RequestStatus,
            passengers: 3,
          },
        ]

        setUpcomingRequests(upcomingMock)
        setPastRequests(pastMock)
      } catch (error) {
        console.error("Error loading travel requests:", error)
        toast({
          title: "Error",
          description: "Failed to load your travel requests",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [toast])

  const handleCreateRequest = () => {
    // In a real app, this would send a request to the backend
    const id = `new-${Date.now()}`
    const createdRequest = {
      id,
      title: newRequest.title,
      from: newRequest.from,
      to: newRequest.to,
      date: newRequest.date,
      time: newRequest.time,
      status: "Pending",
      responses: 0,
      travelMode: newRequest.transportMode,
    }

    setRequests([createdRequest, ...requests])
    setIsCreatingRequest(false)

    // Reset form
    setNewRequest({
      title: "",
      from: "",
      to: "",
      date: "",
      time: "",
      description: "",
      transportMode: "any",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewRequest((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewRequest((prev) => ({ ...prev, [name]: value }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      case "Scheduled":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      case "Pending":
        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const handleCancelRequest = (request: any) => {
    setRequestToCancel(request)
    setCancelDialogOpen(true)
  }

  const confirmCancelRequest = async () => {
    if (!requestToCancel) return

    setActionLoading(true)

    try {
      // In a real app, this would call an API to cancel the request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setUpcomingRequests(upcomingRequests.filter((r) => r.id !== requestToCancel.id))

      toast({
        title: "Request cancelled",
        description:
          requestToCancel.requestType === "offer"
            ? "Your ride offer has been cancelled successfully."
            : "Your ride request has been cancelled successfully.",
      })

      setCancelDialogOpen(false)
      setRequestToCancel(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleRateExperience = (request: any) => {
    setRequestToRate(request)
    setRateDialogOpen(true)
  }

  const submitRating = async () => {
    if (!requestToRate) return

    setActionLoading(true)

    try {
      // In a real app, this would call an API to submit the rating
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Rating submitted",
        description: "Thank you for rating your travel experience!",
      })

      setRateDialogOpen(false)
      setRequestToRate(null)
      setRating(5)
      setReviewComment("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: RequestStatus | string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-saheli-brightgreen text-white">Active</Badge>
      case "completed":
        return (
          <Badge variant="outline" className="border-saheli-brightgreen text-saheli-brightgreen">
            Completed
          </Badge>
        )
      case "cancelled":
        return <Badge className="bg-saheli-brightred text-white">Cancelled</Badge>
      case "expired":
        return <Badge variant="secondary">Expired</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getRequestTypeBadge = (requestType: string) => {
    if (requestType === "offer") {
      return <Badge className="mr-2 bg-saheli-lightgreen text-saheli-green">Offering Ride</Badge>
    } else {
      return <Badge className="mr-2 bg-saheli-lightyellow text-saheli-brightyellow">Requesting Ride</Badge>
    }
  }

  const getTravelModeIcon2 = (mode: string) => {
    switch (mode) {
      case "car":
        return <User className="h-4 w-4 mr-2 text-saheli-brightred" />
      case "cab":
        return <User className="h-4 w-4 mr-2 text-saheli-brightred" />
      case "walk":
        return <User className="h-4 w-4 mr-2 text-saheli-brightyellow" />
      case "bus":
      case "train":
        return <Users className="h-4 w-4 mr-2 text-saheli-brightgreen" />
      default:
        return <User className="h-4 w-4 mr-2 text-muted-foreground" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-saheli-brightred animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading your travel requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Travel Requests</h2>
        <Dialog open={isCreatingRequest} onOpenChange={setIsCreatingRequest}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Travel Request</DialogTitle>
              <DialogDescription>Fill in the details to find a travel companion for your journey</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Request Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g., Evening commute from office"
                  value={newRequest.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    name="from"
                    placeholder="Starting location"
                    value={newRequest.from}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    name="to"
                    placeholder="Destination"
                    value={newRequest.to}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" value={newRequest.date} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" value={newRequest.time} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transportMode">Preferred Transport</Label>
                <Select
                  value={newRequest.transportMode}
                  onValueChange={(value) => handleSelectChange("transportMode", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="public">Public Transport</SelectItem>
                    <SelectItem value="cab">Cab/Taxi</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Any specific requirements or information"
                  value={newRequest.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsCreatingRequest(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRequest}>Create Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {requests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{request.title}</CardTitle>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </div>
                <CardDescription>
                  {request.responses} {request.responses === 1 ? "response" : "responses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">From:</p>
                      <p className="text-muted-foreground">{request.from}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">To:</p>
                      <p className="text-muted-foreground">{request.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{request.date}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{request.time}</p>
                  </div>
                  {request.travelMode && (
                    <div className="flex items-center">
                      {getTravelModeIcon2(request.travelMode)}
                      <p className="capitalize">{request.travelMode}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/dashboard/travel-companion/request/${request.id}`)}
                >
                  View Details
                </Button>
                {request.responses > 0 && (
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/dashboard/travel-companion/chat?id=${request.id}`)}
                  >
                    View Responses
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No travel requests yet</h3>
          <p className="text-muted-foreground mt-1">Create your first request to find travel companions</p>
          <Button className="mt-4" onClick={() => setIsCreatingRequest(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Request
          </Button>
        </div>
      )}

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Travel Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this travel request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelRequest}
              disabled={actionLoading}
              className="bg-saheli-brightred hover:bg-saheli-red"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, cancel request"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rate Experience Dialog */}
      <Dialog open={rateDialogOpen} onOpenChange={setRateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              How was your journey with {requestToRate?.companion?.name || "your travel companions"}?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Share your experience (optional)"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRateDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              className="bg-saheli-brightgreen hover:bg-saheli-green"
              onClick={submitRating}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Rating"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

