"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Send,
  Bot,
  X,
  Loader2,
  MapPin,
  Route,
  Shield,
  AlertTriangle,
  Search,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const SUGGESTED_QUESTIONS = [
  {
    text: "How do I report an unsafe area?",
    icon: <AlertTriangle className="h-3 w-3" />,
  },
  {
    text: "Tips for traveling alone at night?",
    icon: <Shield className="h-3 w-3" />,
  },
  {
    text: "How to plan a safe route?",
    icon: <Route className="h-3 w-3" />,
  },
  {
    text: "What are safety zones on the map?",
    icon: <MapPin className="h-3 w-3" />,
  },
  {
    text: "Get safety info for a specific place",
    icon: <Search className="h-3 w-3" />,
  },
]

export function SafetyChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi, I'm Sakha's safety assistant. How can I help you with your safety needs today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update path to use the correct image extension (.jpg instead of .png)
  const avatarSrc = "/chatbot-avatar.jpg"

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      inputRef.current?.focus()
    }
  }, [messages, isOpen])

  const handleSendMessage = async (
    e?: React.FormEvent,
    questionText?: string
  ) => {
    if (e) e.preventDefault()

    const messageText = questionText || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    // Add user message to local state immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("")
    setIsLoading(true)

    let errorDetails = "Unknown error";
    let serverResponseMessage = "Failed to get response from assistant";

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the whole updated message list to the server
        body: JSON.stringify({ messages: updatedMessages }), 
      })

      if (!response.ok) {
        try {
          const errorData = await response.json();
          
          // Special handling for API key configuration errors (503 Service Unavailable)
          if (response.status === 503 && errorData.response && errorData.response.includes("API key is not configured")) {
            const configMessage: Message = {
              id: "config-error",
              role: "assistant",
              content: "I'm currently unable to answer because my API key isn't configured. Please set up the Gemini API key in the .env.local file to use the chatbot.",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, configMessage])
            setIsLoading(false)
            return;
          }
          
          serverResponseMessage = errorData.error || errorData.response || `Server responded with status ${response.status}`;
          errorDetails = `Status: ${response.status} ${response.statusText}. Server message: ${JSON.stringify(errorData)}`;
        } catch (jsonError) {
          errorDetails = `Status: ${response.status} ${response.statusText}. Could not parse error response.`;
          serverResponseMessage = `Server responded with status ${response.status}, but the error message was not in the expected format.`
        }
        throw new Error("Failed to get response from assistant")
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error(
        `Error sending message: ${error.message} Details: ${errorDetails}`,
        error
      )

      // Add a generic error message as an assistant message
      const errorMessage: Message = {
        id: "error-fallback",
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to my knowledge base. Please check your API configuration or try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])

      toast({
        variant: "destructive",
        title: "Error",
        description: serverResponseMessage,
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(undefined, question)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-saheli-primary hover:bg-saheli-primary-dark shadow-lg z-50 flex items-center justify-center"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-8 w-8 text-white" />
        ) : (
          <Bot className="h-8 w-8 text-white" />
        )}
      </Button>

      <div
        className={cn(
          "fixed bottom-24 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-white border border-saheli-light-gray rounded-lg shadow-xl flex flex-col transition-all duration-300 ease-in-out z-40",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        <div className="p-3 border-b border-saheli-light bg-saheli-primary text-white rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-white">
              <AvatarImage src={avatarSrc} alt="Sakha Assistant Avatar" />
              <AvatarFallback className="bg-saheli-secondary text-white">
                SA
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">Sakha Assistant</p>
              <p className="text-xs ">Safety Companion</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-saheli-primary-dark/50"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-saheli-background">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 bg-saheli-accent self-start">
                  <AvatarImage src={avatarSrc} alt={message.role} />
                  <AvatarFallback className="bg-saheli-secondary text-white">
                    SA
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-3 py-2 text-sm shadow",
                  message.role === "user"
                    ? "bg-saheli-primary text-white rounded-br-none"
                    : "bg-white text-saheli-text rounded-bl-none"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {!isLoading && messages.length > 0 &&
          ((messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].id !== 'error-fallback') ||
           (messages.length === 1 && messages[0].id === 'welcome')) &&
          !input && (
          <div className="p-3 border-t border-saheli-light-gray">
            <p className="text-xs text-saheli-text-light mb-2">
              Or try one of these:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <Button
                  key={q.text}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-auto py-1.5 px-2 justify-start border-saheli-light-gray hover:bg-saheli-light-blue/20 text-saheli-text-medium"
                  onClick={() => handleSuggestedQuestion(q.text)}
                >
                  {q.icon && <span className="mr-1.5">{q.icon}</span>}
                  {q.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-saheli-light-gray bg-white rounded-b-lg flex items-center gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about safety..."
            className="flex-1 focus-visible:ring-1 focus-visible:ring-saheli-primary ring-offset-0"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-saheli-primary hover:bg-saheli-primary-dark text-white"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </>
  )
}

export default SafetyChatbot; 