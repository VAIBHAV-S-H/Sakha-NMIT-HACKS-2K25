"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Car, MessageSquare, Shield } from "lucide-react"

// Mock data for activities
const travelActivities = [
  {
    id: 1,
    type: "ride",
    title: "Ride to Office",
    location: "Home to Tech Park",
    date: "Today",
    time: "9:30 AM",
    status: "completed",
  },
  {
    id: 2,
    type: "ride",
    title: "Evening Return",
    location: "Tech Park to Home",
    date: "Today",
    time: "6:15 PM",
    status: "upcoming",
  },
  {
    id: 3,
    type: "ride",
    title: "Visit to Mall",
    location: "Home to City Center Mall",
    date: "Yesterday",
    time: "11:00 AM",
    status: "completed",
  },
]

const safetyActivities = [
  {
    id: 1,
    type: "alert",
    title: "SOS Alert Triggered",
    location: "Downtown Area",
    date: "3 days ago",
    time: "9:45 PM",
    status: "resolved",
  },
  {
    id: 2,
    type: "zone",
    title: "Entered Safe Zone",
    location: "Home Area",
    date: "Today",
    time: "7:30 PM",
    status: "active",
  },
  {
    id: 3,
    type: "report",
    title: "Reported Unsafe Location",
    location: "Bus Terminal",
    date: "1 week ago",
    time: "8:15 PM",
    status: "verified",
  },
]

const communityActivities = [
  {
    id: 1,
    type: "post",
    title: "Shared Safety Tip",
    content: "Always check cab details before boarding",
    date: "2 days ago",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    type: "comment",
    title: "Commented on Post",
    content: "Great advice! I always do this.",
    date: "3 days ago",
    postTitle: "Night Travel Safety",
  },
  {
    id: 3,
    type: "event",
    title: "Joined Safety Workshop",
    date: "1 week ago",
    location: "Community Center",
    participants: 24,
  },
]

export function ProfileActivity() {
  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Activity</CardTitle>
        <CardDescription>Your recent activities and interactions</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="travel" className="w-full">
          <div className="px-6 pb-2">
            <TabsList className="grid grid-cols-3 h-9">
              <TabsTrigger value="travel" className="text-xs">
                Travel
              </TabsTrigger>
              <TabsTrigger value="safety" className="text-xs">
                Safety
              </TabsTrigger>
              <TabsTrigger value="community" className="text-xs">
                Community
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="travel" className="p-0">
            <div className="divide-y">
              {travelActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-saheli-teal/20 flex items-center justify-center mr-3">
                      <Car className="h-4 w-4 text-saheli-teal" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              activity.status === "completed"
                                ? "border-saheli-success text-saheli-success bg-saheli-success/10"
                                : activity.status === "upcoming"
                                  ? "border-saheli-info text-saheli-info bg-saheli-info/10"
                                  : "border-saheli-warning text-saheli-warning bg-saheli-warning/10"
                            }
                          `}
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="safety" className="p-0">
            <div className="divide-y">
              {safetyActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-saheli-rose/20 flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-saheli-rose" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              activity.status === "resolved"
                                ? "border-saheli-success text-saheli-success bg-saheli-success/10"
                                : activity.status === "active"
                                  ? "border-saheli-info text-saheli-info bg-saheli-info/10"
                                  : "border-saheli-warning text-saheli-warning bg-saheli-warning/10"
                            }
                          `}
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="p-0">
            <div className="divide-y">
              {communityActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-saheli-purple/20 flex items-center justify-center mr-3">
                      <MessageSquare className="h-4 w-4 text-saheli-purple" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      {activity.content && <p className="text-xs text-muted-foreground mt-1">{activity.content}</p>}
                      {activity.postTitle && (
                        <p className="text-xs text-muted-foreground mt-1">On: {activity.postTitle}</p>
                      )}
                      {activity.location && (
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{activity.date}</span>
                        </div>
                        {activity.likes && activity.comments && (
                          <div className="flex items-center space-x-2">
                            <span>{activity.likes} likes</span>
                            <span>•</span>
                            <span>{activity.comments} comments</span>
                          </div>
                        )}
                        {activity.participants && (
                          <div className="flex items-center">
                            <span>{activity.participants} participants</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

