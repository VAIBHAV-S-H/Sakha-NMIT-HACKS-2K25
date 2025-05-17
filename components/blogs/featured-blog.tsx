"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, ChevronRight } from "lucide-react"

export function FeaturedBlog() {
  return (
    <Card className="border shadow-md overflow-hidden">
      <div className="md:flex">
        <div
          className="md:w-2/5 h-48 md:h-auto bg-muted"
          style={{
            backgroundImage: "url('/placeholder.svg?height=400&width=600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <CardContent className="p-6 md:w-3/5">
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-saheli-rose text-white hover:bg-saheli-rose/90">Featured</Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>May 10, 2023</span>
              <span className="mx-1">•</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>5 min read</span>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-2">10 Essential Safety Tips Every Woman Should Know</h2>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            Safety is paramount, especially when traveling alone or in unfamiliar areas. This comprehensive guide covers
            essential safety practices, from being aware of your surroundings to utilizing technology for personal
            security.
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Author" />
                <AvatarFallback>AP</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Anjali Patel</p>
                <p className="text-xs text-muted-foreground">Safety Expert</p>
              </div>
            </div>
            <Button className="bg-saheli-rose hover:bg-saheli-rose/90 text-white">
              Read More
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

