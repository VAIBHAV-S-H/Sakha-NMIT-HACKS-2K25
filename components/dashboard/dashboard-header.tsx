"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, X, Settings, LogOut, User, Shield, Users, MapPin } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { auth } from "@/lib/auth"

export function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Travel Companion", href: "/dashboard/travel-companion" },
    { name: "Community", href: "/dashboard/community" },
    { name: "Safety", href: "/safety" },
    { name: "Blogs", href: "/blogs" },
  ]

  const handleLogout = async () => {
    // Call the auth service to logout
    await auth.logout()
    // Redirect to landing page instead of login
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        {/* Mobile menu button - moved to the left */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold text-saheli-rose">SAHELI</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6 mx-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4 ml-auto">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-saheli-pink/20 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-saheli-pink" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Safety Alert</p>
                    <p className="text-xs text-muted-foreground">Your smart watch has been connected successfully.</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-saheli-orange/20 flex items-center justify-center">
                    <Users className="h-4 w-4 text-saheli-orange" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Travel Request</p>
                    <p className="text-xs text-muted-foreground">Meera accepted your travel companion request.</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-saheli-secondary/20 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-saheli-secondary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Location Alert</p>
                    <p className="text-xs text-muted-foreground">
                      New unsafe location reported near your frequent route.
                    </p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/notifications")}>
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Priya Sharma</p>
                  <p className="text-xs leading-none text-muted-foreground">priya@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 text-base font-medium ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-border">
              <Link
                href="/profile"
                className="block py-2 text-base font-medium text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block py-2 text-base font-medium text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button className="block w-full text-left py-2 text-base font-medium text-red-500" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

