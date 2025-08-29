"use client";
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
import { useEffect, useState } from "react";
type Schedule = {
  id: number;
  departureDate: string; // ISO string
  departureStationId: number;
  arrivalStationId: number;
  trainType: string;
};

type Station = {
  code: number;
  name: string;
};
export default function HomePage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  // instead of names, track station IDs
  const [departureId, setDepartureId] = useState<number | "">("");
  const [arrivalId, setArrivalId] = useState<number | "">("");
  const [date, setDate] = useState("");

  useEffect(() => {
    async function fetchStations() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Station`);
        if (!res.ok) throw new Error("Failed to fetch stations");
        const data = await res.json();
        setStations(data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    }
    fetchStations();
  }, []);
  async function fetchSchedules() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        departureStationId: departureId?.toString() || "",
        arrivalStationId: arrivalId?.toString() || "",
        time: date,
      });

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API
        }/api/Trip/check-schedules?${params.toString()}`
      );

      if (!res.ok) throw new Error("Failed to fetch schedules");
      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
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

      {/* Hero Section with Search */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Journey Starts Here
          </h1>

          {/* Search Form */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <select
                    className="w-full rounded-md border px-3 py-2 bg-input"
                    value={departureId}
                    onChange={(e) =>
                      setDepartureId(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                  >
                    <option value="">Select station</option>
                    {stations.map((s) => (
                      <option
                        key={s.code}
                        value={s.code}
                        disabled={s.code === arrivalId}
                      >
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <select
                    className="w-full rounded-md border px-3 py-2 bg-input"
                    value={arrivalId}
                    onChange={(e) =>
                      setArrivalId(e.target.value ? Number(e.target.value) : "")
                    }
                  >
                    <option value="">Select station</option>
                    {stations.map((s) => (
                      <option
                        key={s.code}
                        value={s.code}
                        disabled={s.code === departureId}
                      >
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    className="bg-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={fetchSchedules}
                disabled={loading}
              >
                <Clock className="mr-2 h-4 w-4" />
                {loading ? "Loading..." : "Check Schedules"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Departures */}
      <section className="py-12 px-4 bg-muted/30" id="schedules">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Upcoming Departures
          </h2>

          {loading ? (
            <p className="text-center text-muted-foreground">
              Fetching schedules...
            </p>
          ) : schedules.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No trips available. Try searching above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.map((trip) => {
                const departureTime = new Date(trip.departureDate);
                const formattedTime = departureTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const formattedDate = departureTime.toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <Card
                    key={trip.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {stations[0].name} → {stations[1].name}
                        </CardTitle>
                        <Badge variant="default">{trip.trainType}</Badge>
                      </div>
                      <CardDescription className="text-xl font-bold text-primary">
                        {formattedTime}{" "}
                        <span className="text-sm">({formattedDate})</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Departure
                        </span>
                        <span className="font-semibold text-foreground">
                          #{trip.id}
                        </span>
                      </div>
                      <Button className="w-full" size="sm">
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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
