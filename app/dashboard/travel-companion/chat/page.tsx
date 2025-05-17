"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ChatWindow } from "@/components/travel-companion/chat-window"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 container px-4 py-8 mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chat with Travel Companion</h1>
          <ChatWindow />
        </main>
      </div>
    </ProtectedRoute>
  )
}

