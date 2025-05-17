"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MapPin, Calendar, Clock, Info, Car, Bus, Train, User, Bike } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CreateTravelRequestForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    from: "",
    to: "",
    date: "",
    time: "",
    transportMode: "any",
    description: "",
    isRecurring: false,
    safetyPreferences: [],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would send the data to the backend
    console.log("Form submitted:", formData)

    toast({
      title: "Request Created",
      description: "Your travel companion request has been created successfully.",
    })

    // Reset form
    setFormData({
      title: "",
      from: "",
      to: "",
      date: "",
      time: "",
      transportMode: "any",
      description: "",
      isRecurring: false,
      safetyPreferences: [],
    })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="title">Request Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="E.g., Evening commute from office"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="from"
              name="from"
              placeholder="Starting point"
              className="pl-9"
              value={formData.from}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="to"
              name="to"
              placeholder="Destination"
              className="pl-9"
              value={formData.to}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="date"
              name="date"
              type="date"
              className="pl-9"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <div className="relative">
            <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="time"
              name="time"
              type="time"
              className="pl-9"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transportMode">Preferred Transport</Label>
          <Select value={formData.transportMode} onValueChange={(value) => handleSelectChange("transportMode", value)}>
            <SelectTrigger id="transportMode">
              <SelectValue placeholder="Select transport mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
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

      <div className="space-y-2">
        <Label htmlFor="description">Additional Details</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Any specific requirements or information about your journey"
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex items-start dark:bg-blue-900/20">
        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 dark:text-blue-400" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          By creating a request, you agree to follow SAHELI's safety guidelines and community standards. All travel
          companions are verified for everyone's safety.
        </p>
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        Create Request
      </Button>
    </form>
  )
}

