"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { OtpAuthForm } from "@/components/auth/otp-auth-form"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const [showOtpForm, setShowOtpForm] = useState(false)
  const [otpIdentifier, setOtpIdentifier] = useState("")

  const { toast } = useToast()

  const handleProceedToOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === "login" && !email.trim()) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please enter your email to login." })
      return
    }
    if (activeTab === "signup" && (!name.trim() || !email.trim())) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please enter your name and email to sign up." })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 200))
    
    setOtpIdentifier(email)
    setShowOtpForm(true)
      setIsLoading(false)
  }

  const handleOtpAuthSuccess = (identifier: string) => {
    setIsLoading(true)
    console.log("Authenticated via OTP with:", identifier)

    localStorage.setItem("saheli_auth_token", "demo_otp_token_12345")
      localStorage.setItem(
        "saheli_user",
        JSON.stringify({
        name: activeTab === "signup" ? name : `User (${identifier.split("@")[0] || identifier.slice(0, 5)})`,
        email: identifier,
        id: `user_otp_${Date.now()}`,
        }),
      )
    toast({ title: "Login Successful!", description: "Redirecting to your dashboard..." })
      router.push("/dashboard")
  }

  if (showOtpForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-saheli-rose/10 via-background to-saheli-purple/10 p-4">
        <OtpAuthForm
          onAuthSuccess={handleOtpAuthSuccess}
          identifierLabel="Email"
          identifierPlaceholder="Enter your email"
        />
        <Button
          variant="link"
          onClick={() => {
            setShowOtpForm(false)
            setOtpIdentifier("")
            setName("")
          }}
          className="mt-4 text-saheli-rose hover:text-saheli-purple"
        >
          &larr; Back to Login/Signup
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saheli-rose/10 via-background to-saheli-purple/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-saheli-rose">SAHELI</h1>
          <p className="text-muted-foreground mt-2">Your safety companion</p>
        </div>

        <Tabs defaultValue="login" value={activeTab} onValueChange={(value) => { setEmail(""); setName(""); setActiveTab(value); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-2 border-saheli-rose/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Login with Email</CardTitle>
                <CardDescription>Enter your email to receive an OTP.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProceedToOtp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-saheli-rose to-saheli-purple hover:from-saheli-purple hover:to-saheli-rose text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Continue with Email"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-2 border-saheli-purple/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>Enter your details and verify with an OTP.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProceedToOtp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-signup">Full Name</Label>
                    <Input
                      id="name-signup"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-saheli-purple to-saheli-rose hover:from-saheli-rose hover:to-saheli-purple text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Sign Up with Email"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

