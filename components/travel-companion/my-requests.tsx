"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Plus } from "lucide-react"
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
  },
]

export function MyRequests() {
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
                    <SelectItem value="auto">Auto Rickshaw</SelectItem>
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
            <Card
              key={request.id}
              className="overflow-hidden transition-all hover:shadow-md dark:hover:border-accent/50"
            >
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
                    onClick={() => router.push(`/dashboard/travel-companion/responses/${request.id}`)}
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
    </div>
  )
}

