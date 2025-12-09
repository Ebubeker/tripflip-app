"use client";

import { useState } from "react";
import { TripPackage } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plane,
  Hotel,
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

interface TripResultCardProps {
  package_: TripPackage;
  aiExplanation?: string;
  onSaveTrip?: () => void;
}

export function TripResultCard({ package_, aiExplanation, onSaveTrip }: TripResultCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (dateTimeString: string) => {
    try {
      return format(new Date(dateTimeString), "HH:mm");
    } catch {
      return dateTimeString;
    }
  };

  const formatDate = (dateTimeString: string) => {
    try {
      return format(new Date(dateTimeString), "MMM dd");
    } catch {
      return dateTimeString;
    }
  };

  const getBadgeColor = (type?: string) => {
    switch (type) {
      case "Cheapest":
        return "bg-green-100 text-green-800 border-green-300";
      case "Best Value":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Most Comfortable":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-2xl">
                {package_.currency} {package_.totalPrice.toFixed(2)}
              </CardTitle>
              {package_.recommendationType && (
                <Badge className={getBadgeColor(package_.recommendationType)}>
                  {package_.recommendationType}
                </Badge>
              )}
            </div>
            <CardDescription>
              {package_.currency} {package_.pricePerPerson.toFixed(2)} per person
            </CardDescription>
          </div>
        </div>

        {aiExplanation && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">{aiExplanation}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Flight Section */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Plane className="h-5 w-5 text-pink-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{package_.flight.airline}</h4>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Outbound:</span>
                  <span>
                    {package_.flight.outboundSegments[0]?.departure.airport}{" "}
                    {formatTime(package_.flight.outboundSegments[0]?.departure.time)} →{" "}
                    {
                      package_.flight.outboundSegments[
                        package_.flight.outboundSegments.length - 1
                      ]?.arrival.airport
                    }{" "}
                    {formatTime(
                      package_.flight.outboundSegments[
                        package_.flight.outboundSegments.length - 1
                      ]?.arrival.time
                    )}
                  </span>
                </div>
                {package_.flight.returnSegments && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Return:</span>
                    <span>
                      {package_.flight.returnSegments[0]?.departure.airport}{" "}
                      {formatTime(package_.flight.returnSegments[0]?.departure.time)} →{" "}
                      {
                        package_.flight.returnSegments[
                          package_.flight.returnSegments.length - 1
                        ]?.arrival.airport
                      }{" "}
                      {formatTime(
                        package_.flight.returnSegments[
                          package_.flight.returnSegments.length - 1
                        ]?.arrival.time
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold mb-2">
                {package_.currency} {package_.flight.totalPrice.toFixed(2)}
              </p>
              <a href={package_.flight.bookingLink} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-1">
                  Book Flight <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Hotel Section with Image */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex gap-4">
            {/* Hotel Image */}
            <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={package_.hotel.imageUrl}
                alt={package_.hotel.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Hotel Info */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <Hotel className="h-5 w-5 text-pink-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{package_.hotel.name}</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      {[...Array(package_.hotel.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-xs text-muted-foreground">
                        ({package_.hotel.rating})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{package_.hotel.location}</span>
                    </div>
                    <p>
                      {package_.currency} {package_.hotel.pricePerNight.toFixed(2)} per night
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold mb-2">
                    {package_.currency} {package_.hotel.totalPrice.toFixed(2)}
                  </p>
                  <a href={package_.hotel.bookingLink} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="gap-1">
                      Book Hotel <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="pt-4 border-t space-y-3">
            <h4 className="font-semibold">Flight Details</h4>
            <div className="space-y-2 text-sm">
              {package_.flight.outboundSegments.map((segment, idx) => (
                <div key={idx} className="pl-4 border-l-2 border-pink-200">
                  <p className="font-medium">
                    {segment.carrier} {segment.flightNumber}
                  </p>
                  <p>
                    {segment.departure.airport} ({formatTime(segment.departure.time)}) →{" "}
                    {segment.arrival.airport} ({formatTime(segment.arrival.time)})
                  </p>
                  <p className="text-muted-foreground">Duration: {segment.duration}</p>
                </div>
              ))}
            </div>
            {package_.flight.returnSegments && (
              <>
                <h4 className="font-semibold mt-3">Return Flight Details</h4>
                <div className="space-y-2 text-sm">
                  {package_.flight.returnSegments.map((segment, idx) => (
                    <div key={idx} className="pl-4 border-l-2 border-pink-200">
                      <p className="font-medium">
                        {segment.carrier} {segment.flightNumber}
                      </p>
                      <p>
                        {segment.departure.airport} ({formatTime(segment.departure.time)}) →{" "}
                        {segment.arrival.airport} ({formatTime(segment.arrival.time)})
                      </p>
                      <p className="text-muted-foreground">Duration: {segment.duration}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {package_.hotel.description && (
              <>
                <h4 className="font-semibold mt-3">Hotel Description</h4>
                <p className="text-sm text-muted-foreground">{package_.hotel.description}</p>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                View Details
              </>
            )}
          </Button>
          {onSaveTrip && (
            <Button onClick={onSaveTrip} className="flex-1 bg-pink-600 hover:bg-pink-700">
              Create Trip
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
