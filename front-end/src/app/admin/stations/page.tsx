"use client";

import type React from "react";

import { useState } from "react";
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
  const [stations, setStations] = useState<Station[]>([
    { code: 1001, name: "Central Station" },
    { code: 1002, name: "North Terminal" },
    { code: 1003, name: "South Junction" },
    { code: 1004, name: "East Plaza" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });

  const handleAdd = () => {
    setEditingStation(null);
    setFormData({ code: "", name: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    setFormData({
      code: station.code.toString(),
      name: station.name,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (code: number) => {
    setStations(stations.filter((station) => station.code !== code));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStation: Station = {
      code: Number.parseInt(formData.code),
      name: formData.name,
    };

    if (editingStation) {
      setStations(
        stations.map((station) =>
          station.code === editingStation.code ? newStation : station
        )
      );
    } else {
      setStations([...stations, newStation]);
    }

    setIsDialogOpen(false);
    setFormData({ code: "", name: "" });
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStation ? "Edit Station" : "Add New Station"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Station Code</Label>
                <Input
                  id="code"
                  type="number"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                />
              </div>
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
