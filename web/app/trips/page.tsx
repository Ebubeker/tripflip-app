"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedTrips, deleteTripFromStorage } from "@/lib/storage";
import { SavedTrip } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Calendar, Users, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

export default function TripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    setTrips(getSavedTrips());
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      deleteTripFromStorage(id);
      loadTrips();
    }
  };

  if (trips.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Trips</h1>
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Plane className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              You haven't saved any trips yet
            </p>
            <Link href="/">
              <Button className="bg-pink-600 hover:bg-pink-700">
                Search for Trips
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Link href="/">
          <Button variant="outline">Search New Trip</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {trips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{trip.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {format(new Date(trip.createdAt), "PPP")}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-pink-600">
                    {trip.selectedPackage.currency} {trip.selectedPackage.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {trip.selectedPackage.currency} {trip.selectedPackage.pricePerPerson.toFixed(2)} per person
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(trip.startDate), "MMM dd")} - {format(new Date(trip.endDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{trip.adults} {trip.adults === 1 ? "traveler" : "travelers"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Plane className="h-4 w-4 text-pink-600" />
                <span className="font-medium">{trip.selectedPackage.flight.airline}</span>
                <span className="text-muted-foreground">•</span>
                <Hotel className="h-4 w-4 text-pink-600" />
                <span className="font-medium">{trip.selectedPackage.hotel.name}</span>
              </div>

              {trip.budget && (
                <div className="text-sm">
                  <span className="font-medium">Budget: </span>
                  <span className={trip.selectedPackage.totalPrice > trip.budget ? "text-red-600" : "text-green-600"}>
                    {trip.selectedPackage.currency} {trip.budget.toFixed(2)}
                    {trip.selectedPackage.totalPrice > trip.budget && " (Over budget)"}
                    {trip.selectedPackage.totalPrice <= trip.budget && " (Within budget)"}
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Link href={`/trips/${trip.id}`} className="flex-1">
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    <Eye className="mr-2 h-4 w-4" />
                    View & Manage
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(trip.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
