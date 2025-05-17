import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-saheli-orange via-saheli-pink to-saheli-secondary"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      <div className="container px-4 mx-auto relative z-10 pt-16">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Safety & Mobility for Women, Powered by AI
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0">
              SAHELI provides intelligent safety features and a trusted women-only mobility network to ensure freedom
              with security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-white text-saheli-brightred hover:bg-white/90 rounded-full">
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-full">
                <Link href="/about">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src="/girl.jpg?height=600&width=600"
                alt="SAHELI mobile app interface showing safety features"
                className="rounded-lg shadow-danger-lg mx-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-danger hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-saheli-brightred rounded-full animate-pulse"></div>
                  <p className="font-medium text-sm text-saheli-brightred">SOS System Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

