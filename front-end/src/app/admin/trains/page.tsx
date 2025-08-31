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

interface Train {
  code: number;
  capacity: number;
  type: string;
  status: string;
}

export default function TrainsPage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);
  const [formData, setFormData] = useState({
    capacity: "",
    type: "",
    status: "",
  });

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Train`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch trains");
      const data: Train[] = await res.json();
      setTrains(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    setEditingTrain(null);
    setFormData({ capacity: "", type: "", status: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (train: Train) => {
    setEditingTrain(train);
    setFormData({
      capacity: train.capacity.toString(),
      type: train.type,
      status: train.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (code: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Train/${code}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete train");
      setTrains(trains.filter((t) => t.code !== code));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTrain: Train = {
      code: editingTrain?.code ?? 0, // temporary 0 for new train
      capacity: Number(formData.capacity),
      type: formData.type,
      status: formData.status,
    };

    try {
      if (editingTrain) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/Train/${editingTrain.code}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTrain),
            credentials: "include",
          }
        );
        // if (!res.ok) throw new Error("Failed to update train");
        if (res.status == 400) {
          const data: any = await res.json();
          setErrorMessage(data.error);
          setIsWarningDialogOpen(true);
        } else {
          setTrains((prev) =>
            prev.map((t) => (t.code === editingTrain.code ? newTrain : t))
          );
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Train`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTrain),
          credentials: "include",
        });
        // if (!res.ok) throw new Error("Failed to create train");
        if (res.status == 400) {
          const data: any = await res.json();
          setErrorMessage(data.error);
          setIsWarningDialogOpen(true);
        } else {
          const created: Train = await res.json();

          setTrains((prev) => [...prev, created]);
        }
      }
    } catch (err) {
      console.error(err);
    }

    setIsDialogOpen(false);
    setFormData({ capacity: "", type: "", status: "" });
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Train Management
            </h1>
            <p className="text-slate-600 mt-2">Manage your train fleet</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Train
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
            <CardTitle>All Trains</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trains.map((train) => (
                  <TableRow key={train.code}>
                    <TableCell className="font-medium">{train.code}</TableCell>
                    <TableCell>{train.capacity}</TableCell>
                    <TableCell>{train.type}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          train.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : train.status === "Maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {train.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(train)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(train.code)}
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
                {editingTrain ? "Edit Train" : "Add New Train"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select train type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Local">Local</SelectItem>
                    <SelectItem value="High-Speed">High-Speed</SelectItem>
                    <SelectItem value="Freight">Freight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
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
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {editingTrain ? "Update" : "Create"}
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
