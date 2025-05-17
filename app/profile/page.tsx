import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileInfo } from "@/components/profile/profile-info"
import { ProfileActivity } from "@/components/profile/profile-activity"
import { ProfileSettings } from "@/components/profile/profile-settings"

export const metadata: Metadata = {
  title: "Profile | SAHELI",
  description: "Your SAHELI profile and safety statistics",
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and account settings</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <ProfileInfo />
            </div>
            <div className="md:col-span-2 space-y-6">
              <ProfileActivity />
              <ProfileSettings />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

