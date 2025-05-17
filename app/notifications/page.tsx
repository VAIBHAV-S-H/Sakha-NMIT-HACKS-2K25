import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Shield, Users, MapPin, Bell, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  // Sample notifications data - in a real app, this would come from an API
  const notifications = [
    {
      id: 1,
      type: "safety",
      title: "Safety Alert",
      message: "Your smart watch has been connected successfully.",
      time: "2 minutes ago",
      read: false,
      icon: <Shield className="h-4 w-4 text-saheli-pink" />,
      iconBg: "bg-saheli-pink/20",
    },
    {
      id: 2,
      type: "travel",
      title: "Travel Request",
      message: "Meera accepted your travel companion request.",
      time: "1 hour ago",
      read: false,
      icon: <Users className="h-4 w-4 text-saheli-orange" />,
      iconBg: "bg-saheli-orange/20",
    },
    {
      id: 3,
      type: "location",
      title: "Location Alert",
      message: "New unsafe location reported near your frequent route.",
      time: "Yesterday",
      read: false,
      icon: <MapPin className="h-4 w-4 text-saheli-secondary" />,
      iconBg: "bg-saheli-secondary/20",
    },
    {
      id: 4,
      type: "safety",
      title: "SOS Test",
      message: "Your monthly SOS test was successful. All emergency contacts would be notified in a real emergency.",
      time: "2 days ago",
      read: true,
      icon: <Shield className="h-4 w-4 text-saheli-pink" />,
      iconBg: "bg-saheli-pink/20",
    },
    {
      id: 5,
      type: "travel",
      title: "Travel Companion",
      message: "Reminder: You have an upcoming travel with Anjali tomorrow at 7 PM.",
      time: "2 days ago",
      read: true,
      icon: <Users className="h-4 w-4 text-saheli-orange" />,
      iconBg: "bg-saheli-orange/20",
    },
    {
      id: 6,
      type: "location",
      title: "Safe Route",
      message: "Your frequently used route has been marked as safe by the community.",
      time: "3 days ago",
      read: true,
      icon: <MapPin className="h-4 w-4 text-saheli-secondary" />,
      iconBg: "bg-saheli-secondary/20",
    },
    {
      id: 7,
      type: "safety",
      title: "Device Connected",
      message: "Your new phone has been connected to Saheli. Your safety settings have been synced.",
      time: "1 week ago",
      read: true,
      icon: <Shield className="h-4 w-4 text-saheli-pink" />,
      iconBg: "bg-saheli-pink/20",
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length
  const safetyCount = notifications.filter((n) => n.type === "safety").length
  const travelCount = notifications.filter((n) => n.type === "travel").length
  const locationCount = notifications.filter((n) => n.type === "location").length

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <Bell className="h-6 w-6 mr-2 text-saheli-primary" />
                Notifications
              </h1>
              <p className="text-muted-foreground">
                Stay updated with safety alerts, travel requests, and location information.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-saheli-light/50 dark:bg-saheli-primary/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-saheli-primary/20 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-saheli-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-saheli-light/50 dark:bg-saheli-primary/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Safety</p>
                  <p className="text-2xl font-bold">{safetyCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-saheli-pink/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-saheli-pink" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-saheli-light/50 dark:bg-saheli-primary/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Travel</p>
                  <p className="text-2xl font-bold">{travelCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-saheli-orange/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-saheli-orange" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-saheli-light/50 dark:bg-saheli-primary/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-2xl font-bold">{locationCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-saheli-secondary/20 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-saheli-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>Your recent alerts, updates, and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="safety">Safety</TabsTrigger>
                  <TabsTrigger value="travel">Travel</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4 space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-3 rounded-lg ${
                        notification.read ? "bg-transparent" : "bg-saheli-light/50 dark:bg-saheli-primary/10"
                      }`}
                    >
                      <div
                        className={`h-10 w-10 rounded-full ${notification.iconBg} flex items-center justify-center shrink-0`}
                      >
                        {notification.icon}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notification.title}</p>
                          {!notification.read && (
                            <Badge variant="outline" className="bg-saheli-primary/10 text-saheli-primary text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="safety" className="mt-4 space-y-4">
                  {notifications
                    .filter((n) => n.type === "safety")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-3 rounded-lg ${
                          notification.read ? "bg-transparent" : "bg-saheli-light/50 dark:bg-saheli-primary/10"
                        }`}
                      >
                        <div
                          className={`h-10 w-10 rounded-full ${notification.iconBg} flex items-center justify-center shrink-0`}
                        >
                          {notification.icon}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            {!notification.read && (
                              <Badge variant="outline" className="bg-saheli-primary/10 text-saheli-primary text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="travel" className="mt-4 space-y-4">
                  {notifications
                    .filter((n) => n.type === "travel")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-3 rounded-lg ${
                          notification.read ? "bg-transparent" : "bg-saheli-light/50 dark:bg-saheli-primary/10"
                        }`}
                      >
                        <div
                          className={`h-10 w-10 rounded-full ${notification.iconBg} flex items-center justify-center shrink-0`}
                        >
                          {notification.icon}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            {!notification.read && (
                              <Badge variant="outline" className="bg-saheli-primary/10 text-saheli-primary text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="location" className="mt-4 space-y-4">
                  {notifications
                    .filter((n) => n.type === "location")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-3 rounded-lg ${
                          notification.read ? "bg-transparent" : "bg-saheli-light/50 dark:bg-saheli-primary/10"
                        }`}
                      >
                        <div
                          className={`h-10 w-10 rounded-full ${notification.iconBg} flex items-center justify-center shrink-0`}
                        >
                          {notification.icon}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            {!notification.read && (
                              <Badge variant="outline" className="bg-saheli-primary/10 text-saheli-primary text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

