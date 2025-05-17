"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Star } from "lucide-react"

// Mock data for community members
const topContributors = [
  {
    id: 1,
    name: "Anjali Patel",
    avatar: "/placeholder.svg?height=32&width=32",
    contributions: 42,
    badge: "Safety Expert",
  },
  {
    id: 2,
    name: "Meera Singh",
    avatar: "/placeholder.svg?height=32&width=32",
    contributions: 38,
    badge: "Travel Guide",
  },
  {
    id: 3,
    name: "Kavita Reddy",
    avatar: "/placeholder.svg?height=32&width=32",
    contributions: 35,
    badge: "Community Leader",
  },
]

// Mock data for community groups
const communityGroups = [
  {
    id: 1,
    name: "Solo Travelers",
    members: 1245,
    isJoined: true,
  },
  {
    id: 2,
    name: "Night Commuters",
    members: 876,
    isJoined: false,
  },
  {
    id: 3,
    name: "Safety Advocates",
    members: 1532,
    isJoined: true,
  },
  {
    id: 4,
    name: "College Students",
    members: 2103,
    isJoined: false,
  },
]

export function CommunitySidebar() {
  const handleJoinGroup = (groupId: string, groupName: string) => {
    // Show a modal or dialog confirming the join
    alert(
      `You've successfully joined the "${groupName}" group! You'll now receive updates and can participate in discussions.`,
    )

    // In a real app, you would make an API call to join the group
    // and then update the UI to reflect the joined status
    console.log(`Joined group: ${groupId}`)
  }

  return (
    <div className="space-y-6">
      {/* Top Contributors */}
      <Card className="border shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center">
            <Award className="h-4 w-4 mr-2 text-saheli-purple" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topContributors.map((contributor) => (
              <div key={contributor.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={contributor.avatar} alt={contributor.name} />
                    <AvatarFallback>
                      {contributor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{contributor.name}</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-saheli-yellow mr-1" />
                      <span className="text-xs text-muted-foreground">{contributor.contributions} points</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs bg-saheli-purple/10 text-saheli-purple border-saheli-purple"
                >
                  {contributor.badge}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Groups */}
      <Card className="border shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center">
            <Users className="h-4 w-4 mr-2 text-saheli-teal" />
            Community Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {communityGroups.map((group) => (
              <div key={group.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{group.name}</p>
                  <p className="text-xs text-muted-foreground">{group.members} members</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto"
                  onClick={() => handleJoinGroup(group.id, group.name)}
                >
                  Join
                </Button>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-3 text-saheli-teal">
            View All Groups
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

