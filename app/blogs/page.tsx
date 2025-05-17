import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BlogList } from "@/components/blogs/blog-list"
import { FeaturedBlog } from "@/components/blogs/featured-blog"

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
            <p className="text-muted-foreground">
              Read stories, tips, and experiences shared by women in our community
            </p>
          </div>

          <FeaturedBlog />
          <BlogList />
        </div>
      </main>
    </div>
  )
}

