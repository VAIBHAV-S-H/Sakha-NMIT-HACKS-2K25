import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CommunityFeed } from "@/components/community/community-feed"
import { CommunityEvents } from "@/components/community/community-events"
import { CommunitySidebar } from "@/components/community/community-sidebar"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Community</h1>
            <p className="text-muted-foreground">Connect with other women, share experiences, and support each other</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <CommunityFeed />
            </div>
            <div className="space-y-6">
              <CommunitySidebar />
              <CommunityEvents />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

