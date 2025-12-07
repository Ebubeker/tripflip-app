"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TripSearchRequest } from "@/lib/types";
import { Search } from "lucide-react";

interface TripSearchFormProps {
  onSearch: (searchParams: TripSearchRequest) => void;
  isLoading: boolean;
}

export function TripSearchForm({ onSearch, isLoading }: TripSearchFormProps) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    startDate: "",
    nights: "3",
    tripType: "return",
    adults: "1",
    budget: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const searchRequest: TripSearchRequest = {
      origin: formData.origin.toUpperCase(),
      destination: formData.destination.toUpperCase(),
      startDate: formData.startDate,
      nights: parseInt(formData.nights),
      oneWay: formData.tripType === "oneWay",
      adults: parseInt(formData.adults),
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
    };

    onSearch(searchRequest);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Plan Your Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">From (Airport Code)</Label>
              <Input
                id="origin"
                placeholder="e.g., JFK, LAX, LHR"
                value={formData.origin}
                onChange={(e) => updateField("origin", e.target.value)}
                required
                maxLength={3}
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">To (Airport Code)</Label>
              <Input
                id="destination"
                placeholder="e.g., CDG, FCO, NRT"
                value={formData.destination}
                onChange={(e) => updateField("destination", e.target.value)}
                required
                maxLength={3}
                className="uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Departure Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nights">Number of Nights</Label>
              <Select
                value={formData.nights}
                onValueChange={(value) => updateField("nights", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {n === 1 ? "night" : "nights"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tripType">Trip Type</Label>
              <Select
                value={formData.tripType}
                onValueChange={(value) => updateField("tripType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="oneWay">One Way</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adults">Number of Travelers</Label>
              <Select
                value={formData.adults}
                onValueChange={(value) => updateField("adults", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {n === 1 ? "adult" : "adults"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 2000"
                value={formData.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              "Searching..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Trips
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
