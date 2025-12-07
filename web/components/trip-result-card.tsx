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
  DollarSign,
  Clock,
  Star,
} from "lucide-react";
import { format } from "date-fns";

interface TripResultCardProps {
  package_: TripPackage;
  aiExplanation?: string;
}

export function TripResultCard({ package_, aiExplanation }: TripResultCardProps) {
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
        <div className="flex items-start gap-3">
          <Plane className="h-5 w-5 text-blue-600 mt-1" />
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
            <p className="font-semibold">
              {package_.currency} {package_.flight.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Hotel className="h-5 w-5 text-green-600 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{package_.hotel.name}</h4>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{package_.hotel.rating.toFixed(1)}</span>
              </div>
              <p className="text-muted-foreground">{package_.hotel.location}</p>
              <p>
                {package_.currency} {package_.hotel.pricePerNight.toFixed(2)} per night
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              {package_.currency} {package_.hotel.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {expanded && (
          <div className="pt-4 border-t space-y-3">
            <h4 className="font-semibold">Flight Details</h4>
            <div className="space-y-2 text-sm">
              {package_.flight.outboundSegments.map((segment, idx) => (
                <div key={idx} className="pl-4 border-l-2 border-blue-200">
                  <p className="font-medium">
                    {segment.carrier} {segment.flightNumber}
                  </p>
                  <p>
                    {segment.departure.airport} ({formatTime(segment.departure.time)}) →{" "}
                    {segment.arrival.airport} ({formatTime(segment.arrival.time)})
                  </p>
                </div>
              ))}
            </div>
            {package_.flight.returnSegments && (
              <>
                <h4 className="font-semibold mt-3">Return Flight Details</h4>
                <div className="space-y-2 text-sm">
                  {package_.flight.returnSegments.map((segment, idx) => (
                    <div key={idx} className="pl-4 border-l-2 border-blue-200">
                      <p className="font-medium">
                        {segment.carrier} {segment.flightNumber}
                      </p>
                      <p>
                        {segment.departure.airport} ({formatTime(segment.departure.time)}) →{" "}
                        {segment.arrival.airport} ({formatTime(segment.arrival.time)})
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
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
      </CardContent>
    </Card>
  );
}
