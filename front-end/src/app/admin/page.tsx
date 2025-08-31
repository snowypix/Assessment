"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Train, MapPin, Users, Calendar, Route } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your railway system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/trains">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Train className="h-6 w-6 text-amber-600 mr-3" />
                  Train Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Add, edit, and manage your train fleet. Configure capacity,
                  type, and status for each train.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/stations">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-6 w-6 text-cyan-600 mr-3" />
                  Station Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Manage railway stations across your network. Add new stations
                  and update existing ones.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/trips">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Route className="h-6 w-6 text-red-600 mr-3" />
                  Trip Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Add, edit, and schedule your trips
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
