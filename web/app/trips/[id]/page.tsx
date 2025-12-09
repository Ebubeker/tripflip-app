"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTripById, saveTripToStorage } from "@/lib/storage";
import { SavedTrip, FlightOption, HotelOption } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BudgetWidget } from "@/components/budget-widget";
import {
  Plane,
  Hotel,
  Calendar,
  Users,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Star,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [availableFlights, setAvailableFlights] = useState<FlightOption[]>([]);
  const [availableHotels, setAvailableHotels] = useState<HotelOption[]>([]);
  const [showFlights, setShowFlights] = useState(false);
  const [showHotels, setShowHotels] = useState(false);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);

  useEffect(() => {
    const savedTrip = getTripById(tripId);
    if (savedTrip) {
      setTrip(savedTrip);
    } else {
      router.push("/trips");
    }
  }, [tripId, router]);

  const handleFetchFlights = async () => {
    if (!trip) return;

    setLoadingFlights(true);
    try {
      const response = await fetch("/api/trip/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: trip.origin,
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
          oneWay: false,
          adults: trip.adults,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const flights: FlightOption[] = data.packages.map((pkg: any) => pkg.flight);
        // Remove duplicates by flight ID
        const uniqueFlights = Array.from(
          new Map(flights.map((f) => [f.id, f])).values()
        ) as FlightOption[];
        setAvailableFlights(uniqueFlights);
        setShowFlights(true);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoadingFlights(false);
    }
  };

  const handleFetchHotels = async () => {
    if (!trip) return;

    setLoadingHotels(true);
    try {
      const response = await fetch("/api/trip/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: trip.origin,
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
          oneWay: false,
          adults: trip.adults,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const hotels: HotelOption[] = data.packages.map((pkg: any) => pkg.hotel);
        // Remove duplicates by hotel ID
        const uniqueHotels = Array.from(
          new Map(hotels.map((h) => [h.id, h])).values()
        ) as HotelOption[];
        setAvailableHotels(uniqueHotels);
        setShowHotels(true);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoadingHotels(false);
    }
  };

  const handleSelectFlight = (flight: FlightOption) => {
    if (!trip) return;

    const updatedTrip: SavedTrip = {
      ...trip,
      selectedPackage: {
        ...trip.selectedPackage,
        flight,
        totalPrice:
          flight.totalPrice + trip.selectedPackage.hotel.totalPrice,
        pricePerPerson:
          (flight.totalPrice + trip.selectedPackage.hotel.totalPrice) /
          trip.adults,
      },
      updatedAt: new Date().toISOString(),
    };

    saveTripToStorage(updatedTrip);
    setTrip(updatedTrip);
    setShowFlights(false);
  };

  const handleSelectHotel = (hotel: HotelOption) => {
    if (!trip) return;

    const updatedTrip: SavedTrip = {
      ...trip,
      selectedPackage: {
        ...trip.selectedPackage,
        hotel,
        totalPrice:
          trip.selectedPackage.flight.totalPrice + hotel.totalPrice,
        pricePerPerson:
          (trip.selectedPackage.flight.totalPrice + hotel.totalPrice) /
          trip.adults,
      },
      updatedAt: new Date().toISOString(),
    };

    saveTripToStorage(updatedTrip);
    setTrip(updatedTrip);
    setShowHotels(false);
  };

  const formatTime = (dateTimeString: string) => {
    try {
      return format(new Date(dateTimeString), "HH:mm");
    } catch {
      return dateTimeString;
    }
  };

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/trips">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Trips
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{trip.name}</h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(trip.startDate), "MMM dd")} -{" "}
            {format(new Date(trip.endDate), "MMM dd, yyyy")} • {trip.adults}{" "}
            {trip.adults === 1 ? "traveler" : "travelers"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-pink-600">
            {trip.selectedPackage.currency}{" "}
            {trip.selectedPackage.totalPrice.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            {trip.selectedPackage.currency}{" "}
            {trip.selectedPackage.pricePerPerson.toFixed(2)} per person
          </p>
        </div>
      </div>

      {/* Budget Widget */}
      {trip.budget && (
        <BudgetWidget
          budget={trip.budget}
          currentCost={trip.selectedPackage.totalPrice}
          currency={trip.selectedPackage.currency}
        />
      )}

      {/* Current Flight */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-pink-600" />
              Selected Flight
            </CardTitle>
            <Button
              onClick={handleFetchFlights}
              disabled={loadingFlights}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loadingFlights ? "animate-spin" : ""}`}
              />
              Fetch Other Flights
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {trip.selectedPackage.flight.airline}
              </h3>
              <div className="text-sm space-y-1 mt-2">
                <div>
                  <span className="font-medium">Outbound: </span>
                  {trip.selectedPackage.flight.outboundSegments[0]?.departure.airport}{" "}
                  {formatTime(
                    trip.selectedPackage.flight.outboundSegments[0]?.departure.time
                  )}{" "}
                  →{" "}
                  {
                    trip.selectedPackage.flight.outboundSegments[
                      trip.selectedPackage.flight.outboundSegments.length - 1
                    ]?.arrival.airport
                  }{" "}
                  {formatTime(
                    trip.selectedPackage.flight.outboundSegments[
                      trip.selectedPackage.flight.outboundSegments.length - 1
                    ]?.arrival.time
                  )}
                </div>
                {trip.selectedPackage.flight.returnSegments && (
                  <div>
                    <span className="font-medium">Return: </span>
                    {trip.selectedPackage.flight.returnSegments[0]?.departure.airport}{" "}
                    {formatTime(
                      trip.selectedPackage.flight.returnSegments[0]?.departure.time
                    )}{" "}
                    →{" "}
                    {
                      trip.selectedPackage.flight.returnSegments[
                        trip.selectedPackage.flight.returnSegments.length - 1
                      ]?.arrival.airport
                    }{" "}
                    {formatTime(
                      trip.selectedPackage.flight.returnSegments[
                        trip.selectedPackage.flight.returnSegments.length - 1
                      ]?.arrival.time
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">
                {trip.selectedPackage.currency}{" "}
                {trip.selectedPackage.flight.totalPrice.toFixed(2)}
              </p>
              <a
                href={trip.selectedPackage.flight.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline" className="gap-1 mt-2">
                  Book <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Flights */}
      {showFlights && availableFlights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent"
                >
                  <div>
                    <p className="font-semibold">{flight.airline}</p>
                    <p className="text-sm text-muted-foreground">
                      {flight.outboundSegments[0]?.departure.airport} →{" "}
                      {
                        flight.outboundSegments[
                          flight.outboundSegments.length - 1
                        ]?.arrival.airport
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {flight.currency} {flight.totalPrice.toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleSelectFlight(flight)}
                      className="mt-1 bg-pink-600 hover:bg-pink-700"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Hotel */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-pink-600" />
              Selected Hotel
            </CardTitle>
            <Button
              onClick={handleFetchHotels}
              disabled={loadingHotels}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loadingHotels ? "animate-spin" : ""}`}
              />
              Fetch Other Hotels
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={trip.selectedPackage.hotel.imageUrl}
                alt={trip.selectedPackage.hotel.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {trip.selectedPackage.hotel.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {[...Array(trip.selectedPackage.hotel.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{trip.selectedPackage.hotel.location}</span>
                </div>
                <p className="text-sm mt-1">
                  {trip.selectedPackage.currency}{" "}
                  {trip.selectedPackage.hotel.pricePerNight.toFixed(2)} per night
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {trip.selectedPackage.currency}{" "}
                  {trip.selectedPackage.hotel.totalPrice.toFixed(2)}
                </p>
                <a
                  href={trip.selectedPackage.hotel.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="gap-1 mt-2">
                    Book <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Hotels */}
      {showHotels && availableHotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-accent"
                >
                  <div className="relative w-24 h-20 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{hotel.name}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(hotel.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {hotel.pricePerNight.toFixed(2)} per night
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {hotel.currency} {hotel.totalPrice.toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleSelectHotel(hotel)}
                        className="mt-1 bg-pink-600 hover:bg-pink-700"
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
