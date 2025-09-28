import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, MapPin, Headphones, CreditCard, Users } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "All buses are verified and follow strict safety protocols for your peace of mind",
  },
  {
    icon: Clock,
    title: "Real-time Tracking",
    description: "Track your bus location and get live updates on departure and arrival times",
  },
  {
    icon: MapPin,
    title: "1000+ Routes",
    description: "Extensive network covering major cities and towns across the country",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support to help you with any queries or issues",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Multiple payment options with secure transactions and instant confirmations",
  },
  {
    icon: Users,
    title: "Group Bookings",
    description: "Special discounts and easy booking process for families and groups",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BusGo?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {
              "Experience the best in bus travel with our comprehensive platform designed for your comfort and convenience"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
