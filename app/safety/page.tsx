import { SafetyMap } from "@/components/safety/safety-map"
import { EmergencyContacts } from "@/components/safety/emergency-contacts"
import { ThreatLocations } from "@/components/safety/threat-locations"
import { SafetyTips } from "@/components/safety/safety-tips"
import { ThreatStatistics } from "@/components/safety/threat-statistics"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SOSButton } from "@/components/safety/sos-button"

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight font-serif">Safety Dashboard</h1>
            <p className="text-muted-foreground font-sans">
              Monitor your safety status, manage emergency contacts, and view threat locations.
            </p>
          </div>

          {/* Add Threat Statistics at the top */}
          <ThreatStatistics />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <EmergencyContacts />
              <ThreatLocations />
            </div>
            <div className="space-y-6">
              <SafetyMap />
              <SafetyTips />
            </div>
          </div>
        </div>
      </main>

      {/* Add SOS Button */}
      <SOSButton />
    </div>
  )
}

