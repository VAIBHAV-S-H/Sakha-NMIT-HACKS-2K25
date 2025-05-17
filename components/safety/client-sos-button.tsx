"use client"

import dynamic from "next/dynamic"

const SOSButton = dynamic(
  () => import("./sos-button").then(mod => ({ default: mod.SOSButton })),
  { ssr: false }
)

export default function ClientSOSButton() {
  return <SOSButton />
} 