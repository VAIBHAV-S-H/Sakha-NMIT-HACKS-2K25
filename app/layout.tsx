import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientThemeProvider } from "@/components/client-theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from 'sonner'
import ClientChatbot from "@/components/chatbot/client-chatbot"
import ClientSOSButton from "@/components/safety/client-sos-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SAHELI - Women's Safety & Mobility App",
  description: "Empowering women with safety features and trusted mobility solutions",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background dark:bg-saheli-twilightDark text-foreground dark:text-white`}
        suppressHydrationWarning
      >
        <ClientThemeProvider>
          {children}
          <ClientChatbot />
          <ClientSOSButton />
          <Toaster />
          <SonnerToaster />
        </ClientThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'