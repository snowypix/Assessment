"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Trip {
  code: number;
  departureDate: Date;
  duration: number;
  delay: number;
  status: string;
  price: number;
  departureStationId: number;
  arrivalStationId: number;
  trainId: number;
}

interface Station {
  code: number;
  name: string;
}

interface Train {
  code: number;
  type: string;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    departureDate: "",
    duration: "",
    delay: "",
    status: "",
    price: "",
    departureStationId: "",
    arrivalStationId: "",
    trainId: "",
  });

  // ✅ Fetch trips, stations, trains
  useEffect(() => {
    fetchTrips();
    fetchStations();
    fetchTrains();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Trip`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch trips");
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Station`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch stations");
      const data = await res.json();
      console.log(data);
      setStations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrains = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Train`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch trains");
      const data = await res.json();
      setTrains(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    setEditingTrip(null);
    setFormData({
      code: "",
      departureDate: "",
      duration: "",
      delay: "",
      status: "",
      price: "",
      departureStationId: "",
      arrivalStationId: "",
      trainId: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      code: trip.code.toString(),
      departureDate: new Date(trip.departureDate).toISOString().slice(0, 16),
      duration: trip.duration.toString(),
      delay: trip.delay.toString(),
      status: trip.status,
      price: trip.price.toString(),
      departureStationId: trip.departureStationId.toString(),
      arrivalStationId: trip.arrivalStationId.toString(),
      trainId: trip.trainId.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (code: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Trip/${code}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete trip");
      setTrips(trips.filter((t) => t.code !== code));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip: Trip = {
      code: 0,
      departureDate: new Date(formData.departureDate),
      duration: Number(formData.duration),
      delay: Number(formData.delay),
      status: formData.status,
      price: Number(formData.price),
      departureStationId: Number(formData.departureStationId),
      arrivalStationId: Number(formData.arrivalStationId),
      trainId: Number(formData.trainId),
    };

    try {
      if (editingTrip) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/Trip/${editingTrip.code}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTrip),
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to update trip");
        setTrips((prev) =>
          prev.map((t) => (t.code === editingTrip.code ? newTrip : t))
        );
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Trip`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTrip),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to create trip");
        const created = await res.json();
        setTrips((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error(err);
    }
    setIsDialogOpen(false);
  };

  // ✅ Helpers to display names
  const getStationName = (id: number) =>
    stations.find((s) => s.code === id)?.name || `#${id}`;
  const getTrainName = (id: number) =>
    trains.find((t) => t.code === id)?.type || `#${id}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Trip Management
            </h1>
            <p className="text-slate-600 mt-2">Manage your trips</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Trip
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Departure Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Delay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Departure Station</TableHead>
                  <TableHead>Arrival Station</TableHead>
                  <TableHead>Train</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.code}>
                    <TableCell>{trip.code}</TableCell>
                    <TableCell>
                      {new Date(trip.departureDate).toLocaleString()}
                    </TableCell>
                    <TableCell>{trip.duration}</TableCell>
                    <TableCell>{trip.delay}</TableCell>
                    <TableCell>{trip.status}</TableCell>
                    <TableCell>{trip.price} MAD</TableCell>
                    <TableCell>
                      {getStationName(trip.departureStationId)}
                    </TableCell>
                    <TableCell>
                      {getStationName(trip.arrivalStationId)}
                    </TableCell>
                    <TableCell>{getTrainName(trip.trainId)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(trip)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(trip.code)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTrip ? "Edit Trip" : "Add New Trip"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="datetime-local"
                  value={formData.departureDate}
                  onChange={(e) =>
                    setFormData({ ...formData, departureDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="delay">Delay (min)</Label>
                <Input
                  id="delay"
                  type="number"
                  value={formData.delay}
                  onChange={(e) =>
                    setFormData({ ...formData, delay: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price (MAD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>

              {/* Departure station select */}
              <div>
                <Label>Departure Station</Label>
                <Select
                  value={formData.departureStationId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departureStationId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select departure station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.length === 0 ? (
                      <SelectItem value="" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      stations.map((s) => (
                        <SelectItem key={s.code} value={s.code.toString()}>
                          {s.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Arrival station select */}
              <div>
                <Label>Arrival Station</Label>
                <Select
                  value={formData.arrivalStationId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, arrivalStationId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select arrival station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.length === 0 ? (
                      <SelectItem value="" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      stations.map((s) => (
                        <SelectItem key={s.code} value={s.code.toString()}>
                          {s.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Train select */}
              <div>
                <Label>Train</Label>
                <Select
                  value={formData.trainId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, trainId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select train" />
                  </SelectTrigger>
                  <SelectContent>
                    {trains.map((t) => (
                      <SelectItem key={t.code} value={t.code.toString()}>
                        {t.type} (#{t.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {editingTrip ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
