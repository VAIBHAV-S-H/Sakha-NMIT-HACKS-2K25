"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Share2, MoreHorizontal, MapPin, Clock, Image, Smile, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for community posts
const initialPosts = [
  {
    id: 1,
    author: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Bangalore",
    },
    content:
      "Just used the SOS feature when I felt unsafe near the bus terminal. My emergency contacts were notified immediately and my friend came to pick me up. This app is a lifesaver! 🙏",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    shares: 3,
    tags: ["safety", "sos"],
    isLiked: false,
  },
  {
    id: 2,
    author: {
      name: "Neha Gupta",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Mumbai",
    },
    content:
      "Found a great carpooling buddy through the app! We've been sharing rides to work for the past month and it's been so convenient and safe. Highly recommend trying the carpooling feature if you haven't already.",
    timestamp: "5 hours ago",
    likes: 18,
    comments: 7,
    shares: 2,
    tags: ["carpooling", "commute"],
    isLiked: true,
  },
  {
    id: 3,
    author: {
      name: "Anjali Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Delhi",
    },
    content:
      "PSA: The area around Central Market has poor lighting at night. I've reported it as a caution zone. Please be careful if you're passing through after 8 PM and preferably travel with someone.",
    timestamp: "1 day ago",
    likes: 42,
    comments: 12,
    shares: 15,
    tags: ["alert", "caution"],
    isLiked: false,
  },
]

export function CommunityFeed() {
  const [posts, setPosts] = useState(initialPosts)
  const [newPost, setNewPost] = useState("")

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          }
        }
        return post
      }),
    )
  }

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const newPostObj = {
        id: Date.now(),
        author: {
          name: "Priya Sharma",
          avatar: "/placeholder.svg?height=40&width=40",
          location: "Bangalore",
        },
        content: newPost,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        shares: 0,
        tags: [],
        isLiked: false,
      }
      setPosts([newPostObj, ...posts])
      setNewPost("")
    }
  }

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Community Feed</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Create post */}
        <div className="p-4 border-b">
          <div className="flex space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Share something with the community..."
                className="min-h-[80px] resize-none"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
                    <Image className="h-4 w-4 mr-1" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </Button>
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
                    <Smile className="h-4 w-4 mr-1" />
                    Feeling
                  </Button>
                </div>
                <Button
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  className="bg-saheli-purple hover:bg-saheli-purple/90 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts feed */}
        <ScrollArea className="h-[600px]">
          <div className="divide-y">
            {posts.map((post) => (
              <div key={post.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{post.author.name}</h4>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{post.author.location}</span>
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Save Post</DropdownMenuItem>
                          <DropdownMenuItem>Report Post</DropdownMenuItem>
                          <DropdownMenuItem>Hide Post</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm">{post.content}</p>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${post.isLiked ? "text-saheli-rose" : "text-foreground"}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-saheli-rose text-saheli-rose" : ""}`} />
                        {post.likes} Likes
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-foreground">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {post.comments} Comments
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-foreground">
                        <Share2 className="h-4 w-4 mr-1" />
                        {post.shares} Shares
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

