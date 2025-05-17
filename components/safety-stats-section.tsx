import { Card, CardContent } from "@/components/ui/card"

export function SafetyStatsSection() {
  const stats = [
    {
      id: 1,
      value: "98%",
      label: "Users Feel Safer",
      description: "Women report feeling significantly safer while traveling with SAHELI",
    },
    {
      id: 2,
      value: "12",
      label: "Safe Rides",
      description: "Completed through our women-only carpooling network",
    },
    {
      id: 3,
      value: "70%",
      label: "Alert Accuracy",
      description: "Our AI correctly identifies genuine distress situations",
    },
    {
      id: 4,
      value: "1 min",
      label: "Average Response Time",
      description: "From alert trigger to emergency contact notification",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-4">Making a Real Difference</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            SAHELI is transforming women's safety and mobility across the country.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Card key={stat.id} className="text-center border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-lg font-medium mb-2">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

