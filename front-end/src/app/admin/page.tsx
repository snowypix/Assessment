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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Train className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Total Trains
                  </p>
                  <p className="text-2xl font-bold text-slate-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-cyan-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Total Stations
                  </p>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-slate-900">1,234</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Today&apos;s Routes
                  </p>
                  <p className="text-2xl font-bold text-slate-900">48</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
