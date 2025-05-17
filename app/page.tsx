import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, MapPin, Users, Wifi, AlertTriangle } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { TestimonialSection } from "@/components/testimonial-section"
import { SafetyStatsSection } from "@/components/safety-stats-section"
import { AppDownloadSection } from "@/components/app-download-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-saheli-orange/30 to-saheli-pink/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative mr-2">
                <Shield className="h-8 w-8 text-white animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-saheli-orange to-saheli-pink opacity-70 blur-sm rounded-full"></div>
                <Shield className="absolute inset-0 h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white gradient-text">SAHELI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white/20 transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-saheli-orange to-saheli-pink text-white hover:opacity-90 transition-all duration-300 hover:scale-105">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight gradient-text sm:text-4xl mb-4">
              Empowering Women with Safety & Mobility
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              SAHELI combines AI-driven safety features with a trusted mobility network to ensure women can travel with
              confidence and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-saheli-pink" />}
              title="AI-Driven Distress Detection"
              description="Automatically detects signs of distress through biometric and behavioral analysis, triggering immediate assistance."
              className="animate-fade-in"
              delay={0.1}
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-saheli-teal" />}
              title="Trusted Travel Companions"
              description="Connect with verified women travelers for safer commutes and travel experiences across all transportation modes."
              className="animate-fade-in"
              delay={0.2}
            />
            <FeatureCard
              icon={<Wifi className="h-10 w-10 text-saheli-orange" />}
              title="Offline Emergency Alerts"
              description="SOS signals work even without internet using Bluetooth Mesh Networking to reach emergency contacts."
              className="animate-fade-in"
              delay={0.3}
            />
            <FeatureCard
              icon={<MapPin className="h-10 w-10 text-saheli-pink" />}
              title="Safe Route Planning"
              description="AI-powered route recommendations based on safety data, real-time monitoring, and community feedback."
              className="animate-fade-in"
              delay={0.4}
            />
            <FeatureCard
              icon={<AlertTriangle className="h-10 w-10 text-saheli-orange" />}
              title="Evidence Collection"
              description="Automatic audio/video recording and secure storage of evidence during emergencies."
              className="animate-fade-in"
              delay={0.5}
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-saheli-teal" />}
              title="Multi-Layer Verification"
              description="Rigorous verification process ensures all community members are trustworthy and reliable."
              className="animate-fade-in"
              delay={0.6}
            />
          </div>

          <div className="text-center mt-12 animate-fade-in">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-saheli-pink to-saheli-orange text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Link href="/about">
                Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SafetyStatsSection />
      <TestimonialSection />
      <AppDownloadSection />
    </div>
  )
}

