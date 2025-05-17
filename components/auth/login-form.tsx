"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store auth data in localStorage for demo purposes
      localStorage.setItem("saheli_auth_token", "demo_token_12345")
      localStorage.setItem(
        "saheli_user",
        JSON.stringify({
          name: "Demo User",
          email: email,
          id: "user_demo_123",
        }),
      )

      // Success - redirect to dashboard
      toast({
        title: "Login successful",
        description: "Welcome back to SAHELI!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-saheli-light dark:border-saheli-primary/20 dark:bg-saheli-dark/90">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-10 w-10 text-saheli-primary dark:text-saheli-accent" />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-saheli-primary dark:text-saheli-light">
          Welcome to SAHELI
        </CardTitle>
        <CardDescription className="text-center dark:text-saheli-light/70">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-saheli-light">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-saheli-primary dark:text-saheli-accent" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-saheli-mauve focus:border-saheli-primary dark:border-saheli-primary/30 dark:bg-saheli-dark dark:text-saheli-light"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="dark:text-saheli-light">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-saheli-primary hover:text-saheli-secondary dark:text-saheli-accent dark:hover:text-saheli-light"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-saheli-primary dark:text-saheli-accent" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 border-saheli-mauve focus:border-saheli-primary dark:border-saheli-primary/30 dark:bg-saheli-dark dark:text-saheli-light"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-saheli-primary dark:text-saheli-accent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-saheli-secondary to-saheli-primary hover:opacity-90 text-white dark:from-saheli-accent dark:to-saheli-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm dark:text-saheli-light/70">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-saheli-primary hover:text-saheli-secondary dark:text-saheli-accent dark:hover:text-saheli-light"
          >
            Sign up
          </Link>
        </div>
        <div className="text-center text-xs text-muted-foreground dark:text-saheli-light/50">
          By continuing, you agree to SAHELI&apos;s{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-saheli-primary dark:hover:text-saheli-accent"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-saheli-primary dark:hover:text-saheli-accent"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </CardFooter>
    </Card>
  )
}

