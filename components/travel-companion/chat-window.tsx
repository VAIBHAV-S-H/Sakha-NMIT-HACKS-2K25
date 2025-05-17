"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Phone, Video, Info, MapPin, Calendar, Clock } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "companion"
  timestamp: Date
}

interface Companion {
  id: string
  name: string
  profileImage: string
  status: string
  lastSeen?: string
}

export function ChatWindow() {
  const searchParams = useSearchParams()
  const companionId = searchParams.get("id") || "1"
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [companion, setCompanion] = useState<Companion>({
    id: companionId,
    name: "Ananya Desai",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "Online",
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I saw you accepted my travel request. Thanks for connecting!",
      sender: "companion",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [tripDetails, setTripDetails] = useState({
    from: "Manyata Tech Park, Bangalore",
    to: "Koramangala 5th Block, Bangalore",
    date: "Today",
    time: "6:30 PM",
    mode: "Cab sharing",
  })

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const message: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate companion response after a short delay
    setTimeout(
      () => {
        // Generate a contextual response based on user input
        let responseContent = ""
        const userMsg = newMessage.toLowerCase()

        if (userMsg.includes("hello") || userMsg.includes("hi") || userMsg.includes("hey")) {
          responseContent = "Hi there! How can I help with your travel plans today?"
        } else if (userMsg.includes("meet") || userMsg.includes("where")) {
          responseContent =
            "Let's meet at the main gate of Manyata Tech Park at 6:30 PM. I'll be wearing a blue jacket so you can spot me easily."
        } else if (userMsg.includes("safe") || userMsg.includes("safety")) {
          responseContent =
            "Don't worry, this area is generally safe. I've traveled this route many times. We'll keep location sharing on throughout the journey."
        } else if (userMsg.includes("time") || userMsg.includes("when")) {
          responseContent = "I'm planning to leave around 6:30 PM. Does that work for you? We can adjust if needed."
        } else if (userMsg.includes("transport") || userMsg.includes("cab") || userMsg.includes("auto")) {
          responseContent =
            "I usually take a cab from here. We can share one to split the cost, or we can book an auto if you prefer."
        } else if (userMsg.includes("cancel") || userMsg.includes("reschedule")) {
          responseContent = "No problem! We can reschedule for another day. Safety first, and plans can change."
        } else if (userMsg.includes("thank")) {
          responseContent = "You're welcome! That's what the Saheli community is for - supporting each other."
        } else {
          responseContent =
            "I understand. Let me know if you need any more details about our travel plan or if you have any safety concerns."
        }

        const responseMessage: Message = {
          id: `companion-${Date.now()}`,
          content: responseContent,
          sender: "companion",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, responseMessage])
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds for realism
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] rounded-lg border bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()} className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </Button>
          <Avatar>
            <AvatarImage src={companion.profileImage} alt={companion.name} />
            <AvatarFallback>{companion.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{companion.name}</h3>
            <p className="text-xs text-green-600 dark:text-green-400">{companion.status}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
            <span className="sr-only">Video</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
            <span className="sr-only">Info</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user" ? "bg-saheli-dusk text-white" : "bg-muted"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{message.content}</span>
                    <span className="text-xs text-right mt-1 opacity-70">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="w-1/3 border-l hidden lg:block overflow-y-auto">
          <Card className="border-0 rounded-none h-full">
            <CardHeader>
              <CardTitle className="text-lg">Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">From:</p>
                      <p className="text-muted-foreground">{tripDetails.from}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">To:</p>
                      <p className="text-muted-foreground">{tripDetails.to}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date:</p>
                      <p className="text-muted-foreground">{tripDetails.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Time:</p>
                      <p className="text-muted-foreground">{tripDetails.time}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium">Transport Mode:</p>
                  <p className="text-muted-foreground">{tripDetails.mode}</p>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Companion Profile</h4>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src={companion.profileImage} alt={companion.name} />
                      <AvatarFallback>{companion.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{companion.name}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">{companion.status}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Full Profile
                  </Button>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Safety Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <p>Live location sharing</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <p>Emergency contacts notified</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <p>Route monitoring active</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}

