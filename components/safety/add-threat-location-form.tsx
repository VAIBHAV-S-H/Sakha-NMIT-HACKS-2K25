"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, AlertTriangle, Camera } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/lib/auth"
import type { ThreatLevel, ThreatCategory, TimeOfDay } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddThreatLocationFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialLatitude?: number
  initialLongitude?: number
}

export function AddThreatLocationForm({
  onSuccess,
  onCancel,
  initialLatitude,
  initialLongitude,
}: AddThreatLocationFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [latitude, setLatitude] = useState(initialLatitude?.toString() || "")
  const [longitude, setLongitude] = useState(initialLongitude?.toString() || "")
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>("medium")
  const [category, setCategory] = useState<ThreatCategory>("other")
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay[]>(["night"])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  const handleTimeOfDayChange = (time: TimeOfDay) => {
    setTimeOfDay((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newFiles])

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index])

    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to report a threat location",
        variant: "destructive",
      })
      return
    }

    if (!name || !description || !latitude || !longitude || timeOfDay.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // In a real app, we would upload the images first and get their URLs
      // For this demo, we'll simulate that process
      const simulatedImageUrls = images.length > 0 ? ["/images/threat-locations/uploaded-threat.jpg"] : []

      const response = await fetch("/api/threat-locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          latitude: Number.parseFloat(latitude),
          longitude: Number.parseFloat(longitude),
          threatLevel,
          category,
          timeOfDay,
          images: simulatedImageUrls,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add threat location")
      }

      toast({
        title: "Location reported",
        description: "Thank you for reporting this location. It will be reviewed by our team.",
        variant: "default",
      })

      // Reset form
      setName("")
      setDescription("")
      setLatitude("")
      setLongitude("")
      setThreatLevel("medium")
      setCategory("other")
      setTimeOfDay(["night"])
      setImages([])
      setImagePreviewUrls([])

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error adding threat location:", error)
      toast({
        title: "Error",
        description: "Failed to add threat location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      <div className="space-y-2">
        <Label htmlFor="name" className="dark:text-saheli-light">
          Location Name
        </Label>
        <Input
          id="name"
          placeholder="E.g., Dark Alley on 5th Street"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-saheli-mauve focus:border-saheli-primary dark:border-saheli-primary/30 dark:bg-saheli-dark dark:text-saheli-light"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="dark:text-saheli-light">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Describe why this location is unsafe..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          className="border-saheli-mauve focus:border-saheli-primary dark:border-saheli-primary/30 dark:bg-saheli-dark dark:text-saheli-light"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude" className="dark:text-saheli-light">
            Latitude
          </Label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-saheli-primary" />
            <Input
              id="latitude"
              type="text"
              placeholder="Latitude"
              className="pl-9 border-saheli-mauve focus:border-saheli-primary dark:border-saheli-primary/30 dark:bg-saheli-dark dark:text-saheli-light"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude" className="dark:text-saheli-light">
            Longitude
          </Label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-saheli-primary" />
            <Input
              id="longitude"
              type="text"
              placeholder="Longitude"
              className="pl-9 border-saheli-mauve focus:border-saheli-primary dark:border-saheli-primary/30 dark:bg-saheli-dark dark:text-saheli-light"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="dark:text-saheli-light">Threat Level</Label>
        <Select value={threatLevel} onValueChange={setThreatLevel}>
          <SelectTrigger className="border-saheli-mauve focus:border-saheli-primary dark:border-saheli-primary/30 dark:bg-saheli-dark dark:text-saheli-light">
            <SelectValue placeholder="Select threat level" />
          </SelectTrigger>
          <SelectContent className="dark:bg-saheli-dark dark:border-saheli-primary/30">
            <SelectItem value="low" className="dark:text-saheli-light">
              Low Risk
            </SelectItem>
            <SelectItem value="medium" className="dark:text-saheli-light">
              Medium Risk
            </SelectItem>
            <SelectItem value="high" className="dark:text-saheli-light">
              High Risk
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="dark:text-saheli-light">Category</Label>
        <RadioGroup
          value={category}
          onValueChange={(value) => setCategory(value as ThreatCategory)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="harassment" id="harassment" />
            <Label htmlFor="harassment" className="dark:text-saheli-light">
              Harassment
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="theft" id="theft" />
            <Label htmlFor="theft" className="dark:text-saheli-light">
              Theft
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="assault" id="assault" />
            <Label htmlFor="assault" className="dark:text-saheli-light">
              Assault
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="poorLighting" id="poorLighting" />
            <Label htmlFor="poorLighting" className="dark:text-saheli-light">
              Poor Lighting
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="isolation" id="isolation" />
            <Label htmlFor="isolation" className="dark:text-saheli-light">
              Isolation
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other" className="dark:text-saheli-light">
              Other
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label className="dark:text-saheli-light">Time of Day</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <Checkbox
              id="morning"
              checked={timeOfDay.includes("morning")}
              onCheckedChange={() => handleTimeOfDayChange("morning")}
            />
            <Label htmlFor="morning" className="dark:text-saheli-light">
              Morning
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <Checkbox
              id="afternoon"
              checked={timeOfDay.includes("afternoon")}
              onCheckedChange={() => handleTimeOfDayChange("afternoon")}
            />
            <Label htmlFor="afternoon" className="dark:text-saheli-light">
              Afternoon
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <Checkbox
              id="evening"
              checked={timeOfDay.includes("evening")}
              onCheckedChange={() => handleTimeOfDayChange("evening")}
            />
            <Label htmlFor="evening" className="dark:text-saheli-light">
              Evening
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <Checkbox
              id="night"
              checked={timeOfDay.includes("night")}
              onCheckedChange={() => handleTimeOfDayChange("night")}
            />
            <Label htmlFor="night" className="dark:text-saheli-light">
              Night
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors col-span-1 sm:col-span-2">
            <Checkbox
              id="allDay"
              checked={timeOfDay.includes("allDay")}
              onCheckedChange={() => handleTimeOfDayChange("allDay")}
            />
            <Label htmlFor="allDay" className="dark:text-saheli-light">
              All Day (Always Unsafe)
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="dark:text-saheli-light">Upload Images (Optional)</Label>
        <div className="border-2 border-dashed border-saheli-blue-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
          <Input id="images" type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
          <Label htmlFor="images" className="cursor-pointer flex flex-col items-center">
            <Camera className="h-8 w-8 text-saheli-primary mb-2" />
            <span className="text-sm font-medium text-saheli-primary">Click to upload</span>
            <span className="text-xs text-muted-foreground">or drag and drop</span>
          </Label>
        </div>

        {imagePreviewUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  className="h-20 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium">Important Note</p>
            <p className="text-sm text-amber-700">
              Only report locations that pose a genuine safety concern. False reports may result in account
              restrictions.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-saheli-mauve hover:bg-saheli-light dark:border-saheli-primary/30 dark:hover:bg-saheli-primary/20 dark:text-saheli-light"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="bg-gradient-to-r from-saheli-secondary to-saheli-primary hover:opacity-90 text-white dark:from-saheli-accent dark:to-saheli-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Submitting...
            </>
          ) : (
            <>
              Report Location
              <AlertTriangle className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

