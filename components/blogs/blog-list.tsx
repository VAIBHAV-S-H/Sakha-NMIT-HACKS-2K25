"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "How to Use Geofencing for Enhanced Safety",
    excerpt:
      "Learn how to set up and use geofencing to create safe zones and get alerts when entering potentially unsafe areas.",
    author: {
      name: "Meera Singh",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Tech Writer",
    },
    date: "May 5, 2023",
    readTime: "4 min read",
    category: "technology",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Finding Safe Accommodation: A Guide for Solo Travelers",
    excerpt: "Tips and tricks for finding and verifying safe accommodation options when traveling alone in new cities.",
    author: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Travel Blogger",
    },
    date: "April 28, 2023",
    readTime: "6 min read",
    category: "travel",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Self-Defense Techniques Every Woman Should Know",
    excerpt: "Basic self-defense moves that can help you protect yourself in threatening situations.",
    author: {
      name: "Kavita Reddy",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Self-Defense Instructor",
    },
    date: "April 20, 2023",
    readTime: "7 min read",
    category: "safety",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Understanding and Reporting Harassment",
    excerpt:
      "A comprehensive guide on identifying different forms of harassment and the proper channels for reporting them.",
    author: {
      name: "Deepa Joshi",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Legal Advisor",
    },
    date: "April 15, 2023",
    readTime: "8 min read",
    category: "safety",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Best Apps for Women's Safety in 2023",
    excerpt: "A roundup of the most effective and user-friendly safety apps designed specifically for women.",
    author: {
      name: "Neha Gupta",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Tech Reviewer",
    },
    date: "April 10, 2023",
    readTime: "5 min read",
    category: "technology",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Community Initiatives for Safer Cities",
    excerpt: "How communities around the country are coming together to make urban spaces safer for women.",
    author: {
      name: "Anjali Patel",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Community Organizer",
    },
    date: "April 5, 2023",
    readTime: "6 min read",
    category: "community",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function BlogList() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 h-9 mb-6">
          <TabsTrigger value="all" className="text-xs">
            All
          </TabsTrigger>
          <TabsTrigger value="safety" className="text-xs">
            Safety
          </TabsTrigger>
          <TabsTrigger value="technology" className="text-xs">
            Technology
          </TabsTrigger>
          <TabsTrigger value="travel" className="text-xs">
            Travel
          </TabsTrigger>
          <TabsTrigger value="community" className="text-xs">
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="safety" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts
              .filter((post) => post.category === "safety")
              .map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="technology" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts
              .filter((post) => post.category === "technology")
              .map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="travel" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts
              .filter((post) => post.category === "travel")
              .map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts
              .filter((post) => post.category === "community")
              .map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button variant="outline" className="border-saheli-rose text-saheli-rose hover:bg-saheli-rose/10">
          Load More Articles
        </Button>
      </div>
    </div>
  )
}

function BlogCard({ post }: { post: (typeof blogPosts)[0] }) {
  return (
    <Card className="border shadow-md overflow-hidden flex flex-col h-full">
      <div
        className="h-48 bg-muted"
        style={{
          backgroundImage: `url('${post.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="outline"
            className={`
              ${
                post.category === "safety"
                  ? "border-saheli-rose text-saheli-rose bg-saheli-rose/10"
                  : post.category === "technology"
                    ? "border-saheli-teal text-saheli-teal bg-saheli-teal/10"
                    : post.category === "travel"
                      ? "border-saheli-purple text-saheli-purple bg-saheli-purple/10"
                      : "border-saheli-yellow text-saheli-yellow bg-saheli-yellow/10"
              }
            `}
          >
            {post.category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{post.date}</span>
          </div>
        </div>

        <h3 className="text-base font-bold mb-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{post.excerpt}</p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

