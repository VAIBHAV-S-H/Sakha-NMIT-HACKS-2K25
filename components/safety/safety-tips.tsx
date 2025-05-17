"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ChevronRight, ChevronLeft } from "lucide-react"

// Mock data for safety tips
const safetyTips = [
  {
    id: 1,
    title: "Share Your Location",
    description: "Always share your live location with trusted contacts when traveling alone.",
    icon: Shield,
  },
  {
    id: 2,
    title: "Stay in Well-Lit Areas",
    description: "Avoid poorly lit streets and shortcuts through isolated areas, especially at night.",
    icon: Shield,
  },
  {
    id: 3,
    title: "Use SOS Feature",
    description: "In case of emergency, use the SOS button to alert your emergency contacts immediately.",
    icon: Shield,
  },
  {
    id: 4,
    title: "Verify Ride Details",
    description: "Always verify the driver and vehicle details before getting into a cab or ride-share.",
    icon: Shield,
  },
  {
    id: 5,
    title: "Trust Your Instincts",
    description: "If something feels wrong, trust your gut feeling and move to a safer location.",
    icon: Shield,
  },
]

export function SafetyTips() {
  const [currentTip, setCurrentTip] = useState(0)

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % safetyTips.length)
  }

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + safetyTips.length) % safetyTips.length)
  }

  const tip = safetyTips[currentTip]

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Safety Tips</CardTitle>
        <CardDescription>Essential tips to keep you safe</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevTip} className="text-foreground hover:bg-muted">
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-center px-4">
            <div className="h-12 w-12 rounded-full bg-saheli-rose/20 flex items-center justify-center mx-auto mb-3">
              <tip.icon className="h-6 w-6 text-saheli-rose" />
            </div>
            <h3 className="font-medium text-base mb-2">{tip.title}</h3>
            <p className="text-sm text-muted-foreground">{tip.description}</p>
          </div>

          <Button variant="ghost" size="icon" onClick={nextTip} className="text-foreground hover:bg-muted">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex justify-center mt-4">
          {safetyTips.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full mx-1 ${index === currentTip ? "bg-saheli-rose" : "bg-muted"}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

