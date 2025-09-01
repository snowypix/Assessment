"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Station {
  code: number;
  name: string;
}

export default function StationsPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Station`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch stations");
      const data = await res.json();
      setStations(data);
    } catch {
      setErrorMessage("An error has occured pleaser reload the page.");
      setIsWarningDialogOpen(true);
    }
  };

  const handleAdd = () => {
    setEditingStation(null);
    setFormData({ name: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (code: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Station/${code}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete station");
      }
      setStations(stations.filter((s) => s.code !== code));
    } catch (err: any) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        setIsWarningDialogOpen(true);
      } else {
        console.error("Unknown error", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStation: Station = {
      code: editingStation?.code ?? 0,
      name: formData.name,
    };

    try {
      if (editingStation) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/Station/${editingStation.code}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newStation),
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to update station");

        setStations((prev) =>
          prev.map((s) => (s.code === editingStation.code ? newStation : s))
        );
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Station`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStation),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to create station");
        const created = await res.json();

        setStations((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error(err);
    }

    setIsDialogOpen(false);
    setFormData({ name: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Station Management
            </h1>
            <p className="text-slate-600 mt-2">Manage your railway stations</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Station
          </Button>
        </div>
        <Dialog
          open={isWarningDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsWarningDialogOpen(false);
            }
            setIsWarningDialogOpen(open);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Missing Data</DialogTitle>
            </DialogHeader>
            <p className="text-slate-700">{errorMessage}</p>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => {
                  setIsWarningDialogOpen(false);
                }}
                className="bg-amber-600 hover:bg-amber-700"
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Card>
          <CardHeader>
            <CardTitle>All Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stations.map((station) => (
                  <TableRow key={station.code}>
                    <TableCell className="font-medium">
                      {station.code}
                    </TableCell>
                    <TableCell>{station.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(station)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(station.code)}
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
                {editingStation ? "Edit Station" : "Add New Station"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div></div>
              <div>
                <Label htmlFor="name">Station Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {editingStation ? "Update" : "Create"}
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
