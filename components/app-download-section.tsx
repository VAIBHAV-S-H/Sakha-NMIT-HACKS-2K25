import { Button } from "@/components/ui/button";
import { AppleIcon, SmartphoneIcon, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function AppDownloadSection() {
  return (
    <>
      <section className="relative py-20 bg-gradient-to-br from-saheli-orange via-saheli-pink to-saheli-secondary text-white overflow-hidden">
        <div className="container px-6 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 font-serif text-primary">
                Your Safety, Your Freedom
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mb-8 font-sans">
                Stay protected with real-time alerts, AI-powered safety tools, and a trusted women-only mobility network. Download the SAHELI app now and take control of your journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-[hsl(0,0%,9%)] text-white hover:bg-opacity-90 rounded-full font-semibold px-6">
                  <AppleIcon className="mr-2 h-5 w-5" /> App Store
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-full font-semibold px-6">
                  <SmartphoneIcon className="mr-2 h-5 w-5" /> Google Play
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center relative">
              <img
                src="/image.png"
                alt="SAHELI mobile app on smartphone"
                className="rounded-xl shadow-2xl max-w-xs relative z-10 border-4"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
      <footer className="mt-16 bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-xl font-bold mb-4 text-primary">About SAHELI</h4>
            <p className="text-white/80 text-sm leading-relaxed">
              SAHELI is dedicated to empowering women with AI-driven safety solutions and a secure mobility network. We believe in technology that ensures freedom and security.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="/features" className="hover:underline">Features</a></li>
              <li><a href="/pricing" className="hover:underline">Pricing</a></li>
              <li><a href="/support" className="hover:underline">Support</a></li>
              <li><a href="/faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 text-primary">Contact Us</h4>
            <p className="text-white/80 text-sm leading-relaxed">
              Email: <a href="mailto:support@saheli.com" className="hover:underline">support@saheli.com</a>
            </p>
            <p className="text-white/80 text-sm">Phone: +91 98765 43210</p>
            <p className="text-white/80 text-sm">Address: Bangalore, India</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 text-primary">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="hover:text-primary"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="hover:text-primary"><Twitter className="w-6 h-6" /></a>
              <a href="#" className="hover:text-primary"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="hover:text-primary"><Linkedin className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-white/70 text-sm">
          &copy; {new Date().getFullYear()} SAHELI. All rights reserved. | <a href="/privacy" className="hover:underline">Privacy Policy</a> | <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>
      </footer>
    </>
  );
}
