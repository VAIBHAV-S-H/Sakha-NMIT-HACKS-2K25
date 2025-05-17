import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Info, MapPin, Clock } from "lucide-react"

export function RecentAlerts() {
  const alerts = [
    {
      id: 1,
      type: "Emergency",
      status: "Resolved",
      location: "Near City Mall",
      date: "Today",
      time: "2:30 PM",
      description: "SOS triggered manually. Emergency contacts notified.",
    },
    {
      id: 2,
      type: "Warning",
      status: "Acknowledged",
      location: "Downtown Area",
      date: "Yesterday",
      time: "8:45 PM",
      description: "Entered high-risk area. Safety recommendations provided.",
    },
    {
      id: 3,
      type: "Info",
      status: "Noted",
      location: "Route to Home",
      date: "3 days ago",
      time: "7:15 PM",
      description: "Unusual route detected. Confirmation received from user.",
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "Emergency":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "Warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "Info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      case "Acknowledged":
        return <Badge className="bg-yellow-500">Acknowledged</Badge>
      case "Noted":
        return <Badge className="bg-blue-500">Noted</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 mb-4">
        <h3 className="font-semibold text-lg">Recent Alerts</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-saheli-secondary hover:text-saheli-primary hover:bg-saheli-light/50 w-full xs:w-auto"
        >
          Read All Notifications
        </Button>
      </div>
      {alerts.map((alert) => (
        <div key={alert.id} className="p-4 border rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
            <div className="flex items-center mb-2 sm:mb-0">
              {getAlertIcon(alert.type)}
              <span className="font-medium ml-2">{alert.type} Alert</span>
              <div className="ml-3">{getStatusBadge(alert.status)}</div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {alert.date}, {alert.time}
              </span>
            </div>
          </div>

          <p className="text-sm mb-3">{alert.description}</p>

          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{alert.location}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            {alert.status !== "Resolved" && (
              <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark as Resolved
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

