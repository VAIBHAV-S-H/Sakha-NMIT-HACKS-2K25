"use client"

import dynamic from "next/dynamic"

const SafetyChatbot = dynamic(
  () => import("./safety-chatbot").then(mod => ({ default: mod.SafetyChatbot })),
  { ssr: false }
)

export default function ClientChatbot() {
  return <SafetyChatbot />
} 