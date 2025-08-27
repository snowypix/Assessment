"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, TrainIcon, MapPin, Clock } from "lucide-react";

interface Trip {
  id: number;
  trainCode: number;
  startStationCode: number;
  endStationCode: number;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  status: string;
}

interface TrainInfo {
  code: number;
  capacity: number;
  type: string;
  status: string;
}

interface Station {
  code: number;
  name: string;
}

export default function TripsPage() {
  // Sample data - in real app this would come from API
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: 1,
      trainCode: 101,
      startStationCode: 1001,
      endStationCode: 1002,
      departureTime: "2024-01-15T08:00",
      arrivalTime: "2024-01-15T09:30",
      durationMinutes: 90,
      status: "Scheduled",
    },
    {
      id: 2,
      trainCode: 102,
      startStationCode: 1002,
      endStationCode: 1003,
      departureTime: "2024-01-15T10:15",
      arrivalTime: "2024-01-15T11:45",
      durationMinutes: 90,
      status: "Scheduled",
    },
    {
      id: 3,
      trainCode: 103,
      startStationCode: 1001,
      endStationCode: 1004,
      departureTime: "2024-01-15T14:30",
      arrivalTime: "2024-01-15T16:15",
      durationMinutes: 105,
      status: "Active",
    },
  ]);

  const trains: TrainInfo[] = [
    { code: 101, capacity: 200, type: "Express", status: "Active" },
    { code: 102, capacity: 150, type: "Local", status: "Active" },
    { code: 103, capacity: 300, type: "High-Speed", status: "Active" },
    { code: 104, capacity: 180, type: "Express", status: "Active" },
  ];

  const stations: Station[] = [
    { code: 1001, name: "Central Station" },
    { code: 1002, name: "North Terminal" },
    { code: 1003, name: "South Junction" },
    { code: 1004, name: "East Plaza" },
    { code: 1005, name: "West End" },
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    trainCode: "",
    startStationCode: "",
    endStationCode: "",
    departureTime: "",
    durationMinutes: "",
  });

  const getTrainInfo = (code: number) => trains.find((t) => t.code === code);
  const getStationName = (code: number) =>
    stations.find((s) => s.code === code)?.name || "Unknown";

  const calculateArrivalTime = (
    departureTime: string,
    durationMinutes: number
  ) => {
    const departure = new Date(departureTime);
    const arrival = new Date(departure.getTime() + durationMinutes * 60000);
    return arrival.toISOString().slice(0, 16);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const arrivalTime = calculateArrivalTime(
      formData.departureTime,
      Number.parseInt(formData.durationMinutes)
    );

    const tripData = {
      trainCode: Number.parseInt(formData.trainCode),
      startStationCode: Number.parseInt(formData.startStationCode),
      endStationCode: Number.parseInt(formData.endStationCode),
      departureTime: formData.departureTime,
      arrivalTime,
      durationMinutes: Number.parseInt(formData.durationMinutes),
      status: "Scheduled",
    };

    if (editingTrip) {
      setTrips(
        trips.map((trip) =>
          trip.id === editingTrip.id ? { ...trip, ...tripData } : trip
        )
      );
    } else {
      const newTrip = {
        id: Math.max(...trips.map((t) => t.id)) + 1,
        ...tripData,
      };
      setTrips([...trips, newTrip]);
    }

    setIsDialogOpen(false);
    setEditingTrip(null);
    setFormData({
      trainCode: "",
      startStationCode: "",
      endStationCode: "",
      departureTime: "",
      durationMinutes: "",
    });
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      trainCode: trip.trainCode.toString(),
      startStationCode: trip.startStationCode.toString(),
      endStationCode: trip.endStationCode.toString(),
      departureTime: trip.departureTime,
      durationMinutes: trip.durationMinutes.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      Scheduled: "default",
      Active: "secondary",
      Completed: "outline",
      Cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Management</h1>
          <p className="text-gray-600 mt-1">Schedule and manage train trips</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTrip ? "Edit Trip" : "Schedule New Trip"}
              </DialogTitle>
              <DialogDescription>
                Configure the train, stations, and timing for this trip.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="train">Train</Label>
                  <Select
                    value={formData.trainCode}
                    onValueChange={(value) =>
                      setFormData({ ...formData, trainCode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select train" />
                    </SelectTrigger>
                    <SelectContent>
                      {trains
                        .filter((t) => t.status === "Active")
                        .map((train) => (
                          <SelectItem
                            key={train.code}
                            value={train.code.toString()}
                          >
                            Train {train.code} - {train.type} ({train.capacity}{" "}
                            seats)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="720"
                    value={formData.durationMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durationMinutes: e.target.value,
                      })
                    }
                    placeholder="90"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startStation">Start Station</Label>
                  <Select
                    value={formData.startStationCode}
                    onValueChange={(value) =>
                      setFormData({ ...formData, startStationCode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select start station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem
                          key={station.code}
                          value={station.code.toString()}
                        >
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endStation">End Station</Label>
                  <Select
                    value={formData.endStationCode}
                    onValueChange={(value) =>
                      setFormData({ ...formData, endStationCode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select end station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations
                        .filter(
                          (s) => s.code.toString() !== formData.startStationCode
                        )
                        .map((station) => (
                          <SelectItem
                            key={station.code}
                            value={station.code.toString()}
                          >
                            {station.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                  id="departureTime"
                  type="datetime-local"
                  value={formData.departureTime}
                  onChange={(e) =>
                    setFormData({ ...formData, departureTime: e.target.value })
                  }
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {editingTrip ? "Update Trip" : "Schedule Trip"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <TrainIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.filter((t) => t.status === "Active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled Trips
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.filter((t) => t.status === "Scheduled").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                trips.reduce((acc, trip) => acc + trip.durationMinutes, 0) /
                  trips.length
              )}
              m
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trips Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Trips</CardTitle>
          <CardDescription>
            Manage all train trips and schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => {
                const train = getTrainInfo(trip.trainCode);
                return (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <div className="font-medium">Train {trip.trainCode}</div>
                      <div className="text-sm text-gray-500">{train?.type}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{getStationName(trip.startStationCode)}</span>
                        <span className="text-gray-400">→</span>
                        <span>{getStationName(trip.endStationCode)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatTime(trip.departureTime)}</TableCell>
                    <TableCell>{formatTime(trip.arrivalTime)}</TableCell>
                    <TableCell>{trip.durationMinutes}m</TableCell>
                    <TableCell>{getStatusBadge(trip.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(trip)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(trip.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
