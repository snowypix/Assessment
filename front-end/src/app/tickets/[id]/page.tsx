"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MapPin, Train, CreditCard, QrCode, Clock } from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";

// ================== Types ==================
interface Ticket {
  id: number;
  code: number;
  qrCode: string;
  class: number;
  passengerName: string;
  passengerEmail: string;
  price: number;
  status: string;
  bookingDate: string;
}

interface Trip {
  id: number;
  code: number;
  departureDate: string;
  duration: number;
  delay: number;
  status: string;
  price: number;
  departureStation: { name: string } | null;
  departureStationId: number;
  arrivalStation: { name: string } | null;
  arrivalStationId: number;
  trainType: string;
  trainId: number;
  prices?: { [classId: number]: number } | null;
}

interface User {
  id: number;
  username: string;
  email: string;
}

// ================== Component ==================
export default function BookTicketPage() {
  const [selectedClass, setSelectedClass] = useState<number>(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedTicket, setBookedTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);

  // ====== Fetch logged-in user info ======
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  // ====== Load trip from localStorage ======
  useEffect(() => {
    const stored = localStorage.getItem("selectedTrip");
    if (stored) {
      setTrip(JSON.parse(stored));
    }
  }, []);

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ====== Book ticket API ======
  const handleBookTicket = async () => {
    if (!trip) return;
    setIsBooking(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tripId: trip.id,
          class: selectedClass,
        }),
      });

      if (!res.ok) throw new Error("Failed to create booking");
      const ticket: Ticket = await res.json();
      setBookedTicket(ticket);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsBooking(false);
    }
  };

  // ====== Ticket Confirmation View ======
  if (bookedTicket && trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-cyan-800">
              RailTime
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mt-4">
              Booking Confirmed!
            </h1>
            <p className="text-slate-600 mt-2">
              Your ticket has been successfully generated
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="text-center bg-green-50 border-b">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-green-800">Ticket Generated</CardTitle>
              <CardDescription>
                Ticket Code: #{bookedTicket.code}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">QR Code:</span>
                  <div className="p-4 bg-white rounded shadow inline-block">
                    <QRCode value={bookedTicket.qrCode} size={128} />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-600">Passenger</Label>
                    <p className="font-medium">
                      {bookedTicket.passengerName || user?.username}
                    </p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Class</Label>
                    <p className="font-medium">
                      {selectedClass === 1 ? "Second Class" : "First Class"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium">
                        {trip.departureStation?.name ??
                          `${localStorage.getItem("departure")}`}
                      </p>
                      <p className="text-sm text-slate-600">
                        Departure: {formatTime(trip.departureDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-7">
                    <div className="w-px h-8 bg-slate-300"></div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium">
                        {trip.arrivalStation?.name ??
                          `${localStorage.getItem("arrival")}`}
                      </p>
                      <p className="text-sm text-slate-600">Arrival: TBD</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Paid:</span>
                  <span className="text-green-600">${bookedTicket.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="mr-4"
            >
              Print Ticket
            </Button>
            <Button asChild>
              <Link href="/">Book Another Ticket</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ====== Booking Form ======
  if (!trip) {
    return <p className="text-center mt-20">Loading trip details...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-cyan-800">
            RailTime
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-4">
            Complete Your Booking
          </h1>
          <p className="text-slate-600 mt-2">
            Choose your comfort class, {user?.username}
          </p>
        </div>

        {/* Trip Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="w-5 h-5" />
              Your Selected Trip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Train:</span>
                <span className="font-medium">
                  {trip.trainType ? `- ${trip.trainType}` : ""}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="font-medium">
                      {trip.departureStation?.name ??
                        `${localStorage.getItem("departure")}`}
                    </p>
                    <p className="text-sm text-slate-600">
                      {formatTime(trip.departureDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-8 h-px bg-slate-300"></div>
                  <Train className="w-4 h-4" />
                  <div className="w-8 h-px bg-slate-300"></div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="font-medium">
                      {trip.arrivalStation?.name ??
                        `${localStorage.getItem("arrival")}`}
                    </p>
                    <p className="text-sm text-slate-600">Arrival: TBD</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                <span>Duration: {trip.duration}m</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Selection */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Choose Comfort Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trip.prices
                ? Object.entries(trip.prices).map(([classId, price]) => (
                    <div
                      key={classId}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedClass === Number(classId)
                          ? "border-amber-500 bg-amber-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => setSelectedClass(Number(classId))}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {classId === "1" ? "Second Class" : "First Class"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {classId === "1"
                              ? "Standard seating with basic amenities"
                              : "Luxury seating with full service"}
                          </p>
                        </div>
                        <p className="font-semibold text-lg">${price}</p>
                      </div>
                    </div>
                  ))
                : // fallback if no dynamic prices
                  [1, 2].map((c) => (
                    <div
                      key={c}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedClass === c
                          ? "border-amber-500 bg-amber-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => setSelectedClass(c)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {c === 1 ? "Second Class" : "First Class"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {c === 1
                              ? "Standard seating with basic amenities"
                              : "Luxury seating with full service"}
                          </p>
                        </div>
                        <p className="font-semibold text-lg">
                          ${trip.price * (c === 1 ? 1 : 2)}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>

        {/* Total + Book Button */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-amber-600">
                  $
                  {trip.prices?.[selectedClass] ??
                    (selectedClass === 1 ? trip.price : trip.price * 2)}
                </span>
              </div>

              <Button
                onClick={handleBookTicket}
                disabled={isBooking || !user}
                className="w-full bg-amber-600 hover:bg-amber-700"
                size="lg"
              >
                {isBooking ? (
                  <>
                    <CreditCard className="w-4 h-4 mr-2 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Book Ticket
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
