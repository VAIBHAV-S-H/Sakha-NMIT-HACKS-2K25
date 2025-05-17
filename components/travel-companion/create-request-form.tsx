"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, Clock, MapPin, Users, Car, Bus, Train, Bike, UserIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/lib/auth"
import mapService from "@/lib/map-service"
import type { TravelMode } from "@/lib/types"

export function CreateRequestForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: new Date(),
    time: "08:00",
    travelMode: "car" as TravelMode,
    requestType: "offer", // "offer" or "request"
    seats: "1",
    price: "",
    notes: "",
  })

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }))
    }
  }

  const validateStep1 = () => {
    if (!formData.from.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your starting location",
        variant: "destructive",
      })
      return false
    }

    if (!formData.to.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your destination",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const validateStep2 = () => {
    if (formData.requestType === "offer" && formData.travelMode === "car" && !formData.price.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a price for your ride offer",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a travel request",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Geocode the locations to get coordinates
      const fromCoordinates = await mapService.geocode(formData.from)
      const toCoordinates = await mapService.geocode(formData.to)

      if (!fromCoordinates || !toCoordinates) {
        toast({
          title: "Location error",
          description: "Could not find one or both of your locations. Please try more specific addresses.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // In a real app, this would call an API to create the request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Request created successfully!",
        description:
          formData.requestType === "offer"
            ? "Your travel offer has been posted. You'll be notified when someone wants to join."
            : "Your travel request has been posted. You'll be notified when someone offers to accompany you.",
      })

      // Redirect to the travel companion dashboard
      router.push("/dashboard/travel-companion?tab=my-requests")
    } catch (error) {
      console.error("Error creating request:", error)
      toast({
        title: "Error",
        description: "Failed to create your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTravelModeIcon = (mode: TravelMode) => {
    switch (mode) {
      case "car":
        return <Car className="h-5 w-5" />
      case "bus":
        return <Bus className="h-5 w-5" />
      case "train":
        return <Train className="h-5 w-5" />
      case "bike":
        return <Bike className="h-5 w-5" />
      case "walk":
        return <UserIcon className="h-5 w-5" />
      default:
        return <Car className="h-5 w-5" />
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Progress indicator */}
      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center",
              i < step ? "text-saheli-rose" : i === step ? "text-saheli-dusk" : "text-muted-foreground",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                i < step
                  ? "bg-saheli-rose text-white"
                  : i === step
                    ? "bg-saheli-dusk text-white"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {i}
            </div>
            <span className="text-xs">{i === 1 ? "Locations" : i === 2 ? "Details" : "Confirm"}</span>
          </div>
        ))}
        <div className="absolute left-0 right-0 h-0.5 bg-muted top-4 -z-10"></div>
      </div>

      {/* Step 1: Locations */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Where are you traveling?</h2>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="from">Starting Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="from"
                  name="from"
                  placeholder="Enter your starting point"
                  value={formData.from}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="to"
                  name="to"
                  placeholder="Enter your destination"
                  value={formData.to}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="button" onClick={handleNextStep} className="w-full bg-saheli-dusk hover:bg-saheli-duskDark">
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Travel Details */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Travel Details</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Request Type</Label>
              <RadioGroup
                value={formData.requestType}
                onValueChange={(value) => handleSelectChange("requestType", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offer" id="offer" />
                  <Label htmlFor="offer" className="cursor-pointer">
                    I'm offering to accompany/drive others
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="request" id="request" />
                  <Label htmlFor="request" className="cursor-pointer">
                    I'm looking for a travel companion
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.date} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Travel Mode</Label>
              <div className="grid grid-cols-5 gap-2">
                {(["car", "bus", "train", "bike", "walk"] as TravelMode[]).map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    variant={formData.travelMode === mode ? "default" : "outline"}
                    className={cn(
                      "flex flex-col items-center py-3",
                      formData.travelMode === mode &&
                        (mode === "car" || mode === "bike"
                          ? "bg-saheli-rose hover:bg-saheli-roseDark"
                          : "bg-saheli-dusk hover:bg-saheli-duskDark"),
                    )}
                    onClick={() => handleSelectChange("travelMode", mode)}
                  >
                    {getTravelModeIcon(mode)}
                    <span className="mt-1 text-xs">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
                  </Button>
                ))}
              </div>
            </div>

            {(formData.travelMode === "car" || formData.travelMode === "bike") && formData.requestType === "offer" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats">Available Seats</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select value={formData.seats} onValueChange={(value) => handleSelectChange("seats", value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select seats" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "seat" : "seats"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Seat (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="e.g. 150"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional information you'd like to share..."
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
            <Button type="button" onClick={handleNextStep} className="bg-saheli-dusk hover:bg-saheli-duskDark">
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Confirm Your Request</h2>

          <div className="border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Request Type</p>
                <p className="font-medium">
                  {formData.requestType === "offer" ? "Offering to Accompany" : "Seeking Companion"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Travel Mode</p>
                <div className="flex items-center">
                  {getTravelModeIcon(formData.travelMode)}
                  <span className="ml-1 font-medium">
                    {formData.travelMode.charAt(0).toUpperCase() + formData.travelMode.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-medium">{formData.from}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">To</p>
                <p className="font-medium">{formData.to}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{format(formData.date, "PPP")}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{formData.time}</p>
              </div>

              {(formData.travelMode === "car" || formData.travelMode === "bike") &&
                formData.requestType === "offer" && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Seats</p>
                      <p className="font-medium">{formData.seats}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Price per Seat</p>
                      <p className="font-medium">₹{formData.price}</p>
                    </div>
                  </>
                )}
            </div>

            {formData.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Additional Notes</p>
                <p>{formData.notes}</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-saheli-duskLight/20 rounded-lg">
            <h3 className="font-medium mb-2">Safety Tips</h3>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>Always verify the identity of your travel companion</li>
              <li>Share your travel details with a trusted friend or family member</li>
              <li>Meet in public places for pickup and drop-off</li>
              <li>Use the in-app chat and avoid sharing personal contact details</li>
              <li>Trust your instincts and cancel if you feel uncomfortable</li>
            </ul>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
            <Button type="submit" disabled={loading} className="bg-saheli-rose hover:bg-saheli-roseDark">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Request...
                </>
              ) : (
                "Create Request"
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}

