import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SettingsPanel } from "@/components/settings/settings-panel"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight font-serif">Account Settings</h1>
            <p className="text-muted-foreground font-sans">
              Manage your account preferences, notifications, and security settings.
            </p>
          </div>

          <SettingsPanel />
        </div>
      </main>
    </div>
  )
}

