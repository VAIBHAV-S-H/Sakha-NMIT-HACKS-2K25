import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

export function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "College Student",
      avatar: "/placeholder.svg?height=100&width=100",
      quote:
        "SAHELI has completely transformed how I travel. I feel so much safer knowing that help is just a gesture away if I need it.",
    },
    {
      id: 2,
      name: "Anita Desai",
      role: "Working Professional",
      avatar: "/placeholder.svg?height=100&width=100",
      quote:
        "The women-only carpooling feature has made my daily commute not just safer, but also more enjoyable. I've made great connections!",
    },
    {
      id: 3,
      name: "Dr. Meera Patel",
      role: "Healthcare Worker",
      avatar: "/placeholder.svg?height=100&width=100",
      quote:
        "As someone who often works late shifts, SAHELI's offline emergency alerts give me peace of mind even in areas with poor connectivity.",
    },
  ]

  return (
    <section className="py-20 bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-4">Hear from Our Community</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Women across the country are experiencing greater freedom and security with SAHELI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-gray-800 border-none text-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
