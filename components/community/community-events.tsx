"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, CalendarDays } from "lucide-react"

// Mock data for community events
const upcomingEvents = [
  {
    id: "1",
    title: "Safety Workshop",
    date: "May 15, 2023",
    time: "10:00 AM - 12:00 PM",
    location: "Community Center, Indiranagar",
    attendees: 24,
    isRegistered: true,
  },
  {
    id: "2",
    title: "Self-Defense Training",
    date: "May 22, 2023",
    time: "4:00 PM - 6:00 PM",
    location: "Sports Complex, Koramangala",
    attendees: 18,
    isRegistered: false,
  },
  {
    id: "3",
    title: "Women in Tech Meetup",
    date: "May 28, 2023",
    time: "3:00 PM - 5:00 PM",
    location: "Tech Hub, Whitefield",
    attendees: 35,
    isRegistered: false,
  },
]

export function CommunityEvents() {
  const handleJoinEvent = (eventId: string, eventName: string) => {
    // Show confirmation to the user
    alert(`You've successfully registered for "${eventName}"! You'll receive event details and updates via email.`)

    // In a real app, you would make an API call to register for the event
    console.log(`Joined event: ${eventId}`)
  }

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center">
          <CalendarDays className="h-4 w-4 mr-2 text-saheli-yellow" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-3 rounded-md bg-muted/50 hover:bg-muted">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{event.title}</h4>
                {event.isRegistered && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-saheli-success/10 text-saheli-success border-saheli-success"
                  >
                    Registered
                  </Badge>
                )}
              </div>
              <div className="space-y-1 text-xs text-muted-foreground mb-3">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
              <Button
                className="w-full bg-saheli-primary hover:bg-saheli-secondary text-white"
                onClick={() => handleJoinEvent(event.id, event.title)}
              >
                Join Event
              </Button>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-3 text-saheli-yellow">
          View All Events
        </Button>
      </CardContent>
    </Card>
  )
}

