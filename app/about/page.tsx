import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, MapPin, Users, Wifi, AlertTriangle, Heart, Code, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold gradient-text">About SAKHA</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="col-span-2 space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Our Mission</h2>
            <p className="text-lg">
              SAKHA is dedicated to empowering women with technology-driven safety solutions that provide confidence,
              independence, and peace of mind. We believe that every woman deserves to move freely without fear, and
              we're committed to making that a reality.
            </p>
            <p>
              Our platform combines AI-powered safety features, community support, and real-time assistance to create a
              comprehensive safety ecosystem for women across India and beyond.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">The Problem We're Solving</h2>
            <p>
              Women's safety remains a critical concern globally, with many women facing restrictions on their mobility
              and independence due to safety concerns. Traditional safety solutions are often reactive rather than
              preventive, and many rely on constant internet connectivity or manual activation during emergencies.
            </p>
            <p>
              SAKHA addresses these gaps with proactive safety measures, offline capabilities, and a trusted community
              network that works together to create safer environments for women.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Our Approach</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="bg-saheli-light/30 dark:bg-saheli-dark/30 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Shield className="h-6 w-6 text-pink mr-2" />
                  <h3 className="font-medium">Technology-First</h3>
                </div>
                <p className="text-sm">
                  We leverage cutting-edge AI, machine learning, and IoT technologies to create intelligent safety
                  systems that can predict, prevent, and respond to safety threats.
                </p>
              </div>

              <div className="bg-light/30 dark:bg-saheli-dark/30 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Users className="h-6 w-6 text-saheli-teal mr-2" />
                  <h3 className="font-medium">Community-Powered</h3>
                </div>
                <p className="text-sm">
                  We build trusted networks of verified women who support each other through travel companionship,
                  safety information sharing, and emergency response.
                </p>
              </div>

              <div className="bg-saheli-light/30 dark:bg-saheli-dark/30 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Globe className="h-6 w-6 text-saheli-orange mr-2" />
                  <h3 className="font-medium">Accessibility-Focused</h3>
                </div>
                <p className="text-sm">
                  Our solutions work across diverse environments, including areas with limited connectivity, and are
                  designed to be accessible to women from all socioeconomic backgrounds.
                </p>
              </div>

              <div className="bg-saheli-light/30 dark:bg-saheli-dark/30 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Heart className="h-6 w-6 text-saheli-pink mr-2" />
                  <h3 className="font-medium">User-Centered</h3>
                </div>
                <p className="text-sm">
                  Every feature we develop is based on extensive research with women about their safety concerns, needs,
                  and preferences to ensure our solutions truly address real-world challenges.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-saheli-pink/10 to-saheli-orange/10 p-6 rounded-lg border border-saheli-light dark:border-saheli-primary/20">
            <h2 className="text-xl font-semibold text-primary mb-4">Key Features</h2>
            <ul className="space-y-3">
              <li className="flex">
                <AlertTriangle className="h-5 w-5 text-saheli-orange mr-2 flex-shrink-0 mt-0.5" />
                <span>AI-driven distress detection system</span>
              </li>
              <li className="flex">
                <Users className="h-5 w-5 text-saheli-teal mr-2 flex-shrink-0 mt-0.5" />
                <span>Verified travel companion network</span>
              </li>
              <li className="flex">
                <Wifi className="h-5 w-5 text-saheli-pink mr-2 flex-shrink-0 mt-0.5" />
                <span>Offline emergency alerts via Bluetooth mesh</span>
              </li>
              <li className="flex">
                <MapPin className="h-5 w-5 text-saheli-orange mr-2 flex-shrink-0 mt-0.5" />
                <span>Safe route planning with real-time monitoring</span>
              </li>
              <li className="flex">
                <Shield className="h-5 w-5 text-saheli-teal mr-2 flex-shrink-0 mt-0.5" />
                <span>Automatic evidence collection during emergencies</span>
              </li>
              <li className="flex">
                <Code className="h-5 w-5 text-saheli-pink mr-2 flex-shrink-0 mt-0.5" />
                <span>Community-sourced safety information</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-saheli-secondary/10 to-saheli-primary/10 p-6 rounded-lg border border-saheli-light dark:border-saheli-primary/20">
            <h2 className="text-xl font-semibold text-primary mb-4">Our Impact</h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">12+</div>
                <div className="text-sm text-muted-foreground">Safe Journeys Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">10+</div>
                <div className="text-sm text-muted-foreground">Emergency Situations Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green">2+</div>
                <div className="text-sm text-muted-foreground">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-saheli-primary mb-6">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: "S Hari Priya",
              role: "UI and web application",
              bio: "CSE 3rd Year Student",
            },
            {
              name: "Vaibhav S H",
              role: "AI Distress Detection",
              bio: "CSE 3rd Year Student",
            },
          ].map((member, index) => (
            <div key={index} className="bg-white dark:bg-saheli-dark/50 p-6 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-saheli-pink to-saheli-orange rounded-full mb-4 flex items-center justify-center text-white text-xl font-bold">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-saheli-primary mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-saheli-primary mb-6">Join Our Mission</h2>
        <div className="bg-gradient-to-r from-saheli-pink/20 to-saheli-orange/20 p-8 rounded-lg text-center">
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            We're building a safer world for women, one journey at a time. Join our community today and be part of the
            change.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-saheli-pink to-saheli-orange text-white hover:opacity-90"
            asChild
          >
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

