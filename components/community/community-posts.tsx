"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageSquare, Share, MoreHorizontal, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CommunityPostsProps {
  searchQuery?: string
}

export function CommunityPosts({ searchQuery }: CommunityPostsProps) {
  const { toast } = useToast()

  // Mock data - in a real app, this would come from an API
  const posts = [
    {
      id: 1,
      user: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      content:
        "Just used the SOS feature during a sketchy situation near MG Road. The response was immediate and I felt so much safer. Thank you SAHELI team for creating this amazing app! 🙏",
      images: ["/placeholder.svg?height=300&width=500"],
      likes: 42,
      comments: 8,
      time: "2 hours ago",
      tags: ["safety", "sos"],
    },
    {
      id: 2,
      user: {
        name: "Neha Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      content:
        "Looking for a travel companion for my daily commute from Indiranagar to Whitefield. I usually leave around 8:30 AM and return by 6:30 PM. Anyone interested in carpooling or traveling together?",
      images: [],
      likes: 15,
      comments: 23,
      time: "5 hours ago",
      tags: ["travel", "commute"],
    },
    {
      id: 3,
      user: {
        name: "Anjali Desai",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: false,
      },
      content:
        "Attended the self-defense workshop organized by SAHELI yesterday. Learned so many practical techniques! Highly recommend joining the next one if you missed it.",
      images: ["/placeholder.svg?height=300&width=500", "/placeholder.svg?height=300&width=500"],
      likes: 78,
      comments: 12,
      time: "1 day ago",
      tags: ["self-defense", "workshop"],
    },
  ]

  // Filter posts based on search query
  const filteredPosts = searchQuery
    ? posts.filter(
        (post) =>
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          post.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : posts

  const handleLike = (postId: number) => {
    toast({
      title: "Post liked",
      description: "You have liked this post",
    })
  }

  const handleComment = (postId: number, comment: string) => {
    if (!comment.trim()) return

    toast({
      title: "Comment added",
      description: "Your comment has been added to the post",
    })
  }

  const handleShare = (postId: number) => {
    toast({
      title: "Post shared",
      description: "Post has been shared successfully",
    })
  }

  return (
    <div className="space-y-6">
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No posts found matching your search.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} onShare={handleShare} />
        ))
      )}
    </div>
  )
}

interface PostCardProps {
  post: {
    id: number
    user: {
      name: string
      avatar: string
      verified: boolean
    }
    content: string
    images: string[]
    likes: number
    comments: number
    time: string
    tags: string[]
  }
  onLike: (postId: number) => void
  onComment: (postId: number, comment: string) => void
  onShare: (postId: number) => void
}

function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(false)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <p className="font-medium">{post.user.name}</p>
                {post.user.verified && (
                  <Badge variant="outline" className="ml-2 text-xs border-saheli-red text-saheli-red">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{post.time}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
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
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4 whitespace-pre-line">{post.content}</p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-saheli-coral/10 text-saheli-darkred hover:bg-saheli-coral/20"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {post.images.length > 0 && (
          <div className={`grid ${post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-2 mb-4`}>
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`Post by ${post.user.name}`}
                className="rounded-md w-full h-auto object-cover"
              />
            ))}
          </div>
        )}

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{post.likes} likes</span>
          <span>{post.comments} comments</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col">
        <div className="flex justify-between w-full border-t border-b py-2 mb-4">
          <Button variant="ghost" size="sm" onClick={() => onLike(post.id)}>
            <Heart className="h-4 w-4 mr-2" />
            Like
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onShare(post.id)}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {showComments && (
          <div className="w-full">
            <div className="flex gap-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex">
                <Textarea
                  placeholder="Write a comment..."
                  className="min-h-[40px] flex-1 resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  size="icon"
                  className="ml-2 bg-saheli-red hover:bg-saheli-darkred"
                  onClick={() => {
                    onComment(post.id, comment)
                    setComment("")
                  }}
                  disabled={!comment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sample comments - in a real app, these would come from an API */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Commenter avatar" />
                  <AvatarFallback>CA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">Ritu Kapoor</p>
                      <span className="text-xs text-muted-foreground">1 hour ago</span>
                    </div>
                    <p className="text-sm">
                      This is so helpful! I've been looking for travel companions for my daily commute too.
                    </p>
                  </div>
                  <div className="flex gap-4 mt-1 ml-2">
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
                      Like
                    </Button>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Commenter avatar" />
                  <AvatarFallback>CA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">Meera Singh</p>
                      <span className="text-xs text-muted-foreground">30 minutes ago</span>
                    </div>
                    <p className="text-sm">I had a similar experience with the SOS feature. It's a lifesaver!</p>
                  </div>
                  <div className="flex gap-4 mt-1 ml-2">
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
                      Like
                    </Button>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

