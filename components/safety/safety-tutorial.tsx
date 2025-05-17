"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, MapPin, Bell, Users, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"

const tutorialSteps = [
  {
    title: "Welcome to Safety Features",
    description: "Learn how to use SAHELI's safety features to stay secure during your travels.",
    icon: Shield,
    content: (
      <div className="space-y-4">
        <p>
          SAHELI provides multiple safety features designed to help you travel with confidence. This tutorial will guide
          you through the key safety tools available to you.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 rounded-lg bg-pink-50 text-center">
            <MapPin className="h-8 w-8 text-saheli-primary mb-2" />
            <h3 className="font-medium">Safety Map</h3>
            <p className="text-sm text-muted-foreground">View and report unsafe areas</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 text-center">
            <Bell className="h-8 w-8 text-saheli-secondary mb-2" />
            <h3 className="font-medium">Safety Alerts</h3>
            <p className="text-sm text-muted-foreground">Get notified about nearby risks</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Safety Map",
    description: "Navigate safely with our interactive safety map.",
    icon: MapPin,
    content: (
      <div className="space-y-4">
        <p>The Safety Map shows you areas that have been reported as unsafe by other women in the community.</p>
        <div className="rounded-lg overflow-hidden border">
          <img src="/images/safety/safety-map-demo.jpg" alt="Safety Map Demo" className="w-full h-48 object-cover" />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-start">
            <div className="h-4 w-4 rounded-full bg-red-500 mt-1 mr-2"></div>
            <div>
              <p className="font-medium">High Risk Areas</p>
              <p className="text-sm text-muted-foreground">Areas with multiple reports of serious safety concerns</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="h-4 w-4 rounded-full bg-amber-500 mt-1 mr-2"></div>
            <div>
              <p className="font-medium">Medium Risk Areas</p>
              <p className="text-sm text-muted-foreground">Areas with some safety concerns or limited visibility</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="h-4 w-4 rounded-full bg-blue-500 mt-1 mr-2"></div>
            <div>
              <p className="font-medium">Low Risk Areas</p>
              <p className="text-sm text-muted-foreground">Areas with minor concerns that require basic caution</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Reporting Unsafe Areas",
    description: "Help other women by reporting unsafe locations.",
    icon: AlertTriangle,
    content: (
      <div className="space-y-4">
        <p>If you encounter an unsafe area, you can report it to help other women avoid it.</p>
        <div className="bg-gradient-to-r from-saheli-pink-100 to-saheli-blue-100 p-4 rounded-lg">
          <h3 className="font-medium text-saheli-primary mb-2">How to Report:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click on "Report Unsafe Location" on the Safety Map</li>
            <li>Mark the location on the map or enter coordinates</li>
            <li>Describe why the area feels unsafe</li>
            <li>Select the threat level and category</li>
            <li>Add photos if available (optional)</li>
            <li>Submit your report</li>
          </ol>
        </div>
        <p className="text-sm text-muted-foreground">
          Your reports are verified by our community moderators and help keep other women safe.
        </p>
      </div>
    ),
  },
  {
    title: "Safe Route Planning",
    description: "Plan routes that avoid unsafe areas.",
    icon: MapPin,
    content: (
      <div className="space-y-4">
        <p>SAHELI can help you plan routes that avoid areas reported as unsafe.</p>
        <div className="rounded-lg overflow-hidden border">
          <img src="/images/safety/safe-route-demo.jpg" alt="Safe Route Demo" className="w-full h-48 object-cover" />
        </div>
        <div className="bg-saheli-blue-100 p-4 rounded-lg">
          <h3 className="font-medium text-saheli-secondary mb-2">Safe Route Features:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Automatically avoids high-risk areas</li>
            <li>Prefers well-lit and populated streets</li>
            <li>Shows alternative routes with safety ratings</li>
            <li>Updates in real-time based on new reports</li>
            <li>Works for walking, public transit, and driving</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Community Safety",
    description: "Connect with other women for safer travel.",
    icon: Users,
    content: (
      <div className="space-y-4">
        <p>SAHELI's community features help you connect with other women for safer travel.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 rounded-lg bg-pink-50 text-center">
            <Users className="h-8 w-8 text-saheli-primary mb-2" />
            <h3 className="font-medium">Travel Companions</h3>
            <p className="text-sm text-muted-foreground">Find companions for your journey</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 text-center">
            <Bell className="h-8 w-8 text-saheli-secondary mb-2" />
            <h3 className="font-medium">Safety Alerts</h3>
            <p className="text-sm text-muted-foreground">Share real-time safety alerts</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Join the SAHELI community to connect with other women and travel more safely together.
        </p>
      </div>
    ),
  },
]

export function SafetyTutorial() {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentTutorialStep = tutorialSteps[currentStep]
  const Icon = currentTutorialStep.icon

  return (
    <Card className="w-full border-saheli-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-saheli-primary to-saheli-blue-500 text-white">
        <div className="flex items-center">
          <Icon className="h-6 w-6 mr-2" />
          <div>
            <CardTitle>{currentTutorialStep.title}</CardTitle>
            <CardDescription className="text-white/80">{currentTutorialStep.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">{currentTutorialStep.content}</CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="border-saheli-blue-200"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentStep ? "bg-saheli-primary" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <Button
          onClick={handleNext}
          disabled={currentStep === tutorialSteps.length - 1}
          className="bg-gradient-to-r from-saheli-primary to-saheli-blue-500 text-white"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}

