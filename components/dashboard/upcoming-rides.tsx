import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users } from "lucide-react"

export function UpcomingRides() {
  const rides = [
    {
      id: 1,
      type: "Carpool",
      from: "Home",
      to: "Office",
      date: "Today",
      time: "9:00 AM",
      passengers: 2,
      driver: {
        name: "Neha Singh",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
      },
    },
    {
      id: 2,
      type: "Carpool",
      from: "Office",
      to: "Home",
      date: "Today",
      time: "6:30 PM",
      passengers: 3,
      driver: {
        name: "Ritu Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
      },
    },
  ]

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <div
          key={ride.id}
          className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-white"
        >
          <div className="flex items-start space-x-4 mb-4 md:mb-0">
            <div>
              <Badge className="mb-2">{ride.type}</Badge>
              <h4 className="font-medium text-lg mb-1">
                {ride.from} to {ride.to}
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-y-1 sm:gap-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {ride.date}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {ride.time}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {ride.passengers} passengers
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
                <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{ride.driver.name}</p>
                <p className="text-xs text-muted-foreground">⭐ {ride.driver.rating} rating</p>
              </div>
            </div>
            <Button size="sm">View Details</Button>
          </div>
        </div>
      ))}
    </div>
  )
}

