import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Train, Users, Shield, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 ">
              <Train className="h-8 w-8" />
              <span className="text-2xl font-bold">RailTime</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#schedules"
                className="text-foreground hover:text-primary transition-colors"
              >
                Schedules
              </a>
              <a
                href="#booking"
                className="text-foreground hover:text-primary transition-colors"
              >
                Book Tickets
              </a>
              <a
                href="#travel-info"
                className="text-foreground hover:text-primary transition-colors"
              >
                Travel Info
              </a>
              <Button variant="outline" size="sm" asChild>
                <a href="/login">Sign In</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Your Journey Starts Here
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Find train schedules, book tickets, and travel with confidence
            across the country. Fast, reliable, and always on time.
          </p>

          {/* Search Form */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    From
                  </label>
                  <Input placeholder="Departure station" className="bg-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    To
                  </label>
                  <Input placeholder="Arrival station" className="bg-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Date
                  </label>
                  <Input type="date" className="bg-input" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" size="lg">
                  <Clock className="mr-2 h-4 w-4" />
                  Check Schedules
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  size="lg"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Book Tickets
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Departures */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Upcoming Departures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                route: "New York → Boston",
                time: "08:30 AM",
                duration: "3h 45m",
                price: "$89",
                status: "On Time",
              },
              {
                route: "Chicago → Detroit",
                time: "09:15 AM",
                duration: "5h 20m",
                price: "$67",
                status: "Delayed 10min",
              },
              {
                route: "Los Angeles → San Francisco",
                time: "10:00 AM",
                duration: "12h 15m",
                price: "$156",
                status: "On Time",
              },
              {
                route: "Miami → Orlando",
                time: "11:30 AM",
                duration: "5h 30m",
                price: "$78",
                status: "On Time",
              },
              {
                route: "Seattle → Portland",
                time: "12:45 PM",
                duration: "3h 30m",
                price: "$45",
                status: "On Time",
              },
              {
                route: "Washington DC → Philadelphia",
                time: "02:15 PM",
                duration: "1h 45m",
                price: "$34",
                status: "On Time",
              },
            ].map((departure, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{departure.route}</CardTitle>
                    <Badge
                      variant={
                        departure.status === "On Time"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {departure.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-2xl font-bold text-primary">
                    {departure.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {departure.duration}
                    </span>
                    <span className="font-semibold text-foreground">
                      {departure.price}
                    </span>
                  </div>
                  <Button className="w-full" size="sm">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose RailTime?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reliable Service</h3>
              <p className="text-muted-foreground">
                99.2% on-time performance with real-time updates and
                notifications for any changes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Booking</h3>
              <p className="text-muted-foreground">
                Book your tickets in under 2 minutes with our streamlined
                booking process.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our customer service team is available around the clock to
                assist with your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">Travel Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Arrive Early</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Arrive at the station at least 30 minutes before departure for
                  a stress-free boarding experience.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pack Smart</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bring essentials in a carry-on bag and check our baggage
                  policy for larger items.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stay Connected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Download our mobile app for real-time updates, digital
                  tickets, and station maps.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comfort Features</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enjoy free Wi-Fi, power outlets, and spacious seating on all
                  our trains.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Train className="h-6 w-6" />
                <span className="text-xl font-bold">RailTime</span>
              </div>
              <p className="text-secondary-foreground/80">
                Your trusted partner for rail travel across the country.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-secondary-foreground/80">
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Train Schedules
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Ticket Booking
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Group Travel
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Business Class
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-secondary-foreground/80">
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Customer Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Travel Insurance
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Refunds & Changes
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-secondary-foreground/80">
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary-foreground transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-secondary-foreground/80">
            <p>&copy; 2024 RailTime. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
