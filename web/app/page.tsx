"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TripSearchForm } from "@/components/trip-search-form";
import { TripResultCard } from "@/components/trip-result-card";
import { TripSummary } from "@/components/trip-summary";
import { BudgetWidget } from "@/components/budget-widget";
import { TripSearchRequest, TripSearchResponse, TripPackage, SavedTrip } from "@/lib/types";
import { saveTripToStorage } from "@/lib/storage";
import { Loader2, AlertCircle } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TripSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<TripSearchRequest | null>(null);

  const handleSearch = async (params: TripSearchRequest) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setSearchParams(params);

    try {
      const response = await fetch("/api/trip/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to search trips");
      }

      const data: TripSearchResponse = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrip = (pkg: TripPackage) => {
    if (!searchParams) return;

    // Calculate end date
    let endDate = searchParams.endDate;
    if (!endDate && searchParams.nights) {
      const startDate = new Date(searchParams.startDate);
      const endDateObj = new Date(startDate);
      endDateObj.setDate(startDate.getDate() + searchParams.nights);
      endDate = endDateObj.toISOString().split("T")[0];
    }

    const tripId = `trip-${Date.now()}`;
    const savedTrip: SavedTrip = {
      id: tripId,
      name: `${searchParams.origin} → ${searchParams.destination}`,
      origin: searchParams.origin,
      destination: searchParams.destination,
      startDate: searchParams.startDate,
      endDate: endDate || searchParams.startDate,
      adults: searchParams.adults,
      selectedPackage: pkg,
      budget: searchParams.budget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveTripToStorage(savedTrip);
    router.push(`/trips/${tripId}`);
  };

  // Calculate the cheapest package for budget widget
  const cheapestPackage = results?.packages[0]; // Already sorted by price

  return (
    <div className="space-y-8">
      <TripSearchForm onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Searching for the best trips...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="font-semibold">Error</p>
          </div>
          <p className="text-sm mt-1 text-destructive/80">{error}</p>
        </div>
      )}

      {results && !isLoading && (
        <div className="space-y-6">
          {results.aiSummary && <TripSummary summary={results.aiSummary} />}

          {/* Budget Widget */}
          {searchParams?.budget && cheapestPackage && (
            <BudgetWidget
              budget={searchParams.budget}
              currentCost={cheapestPackage.totalPrice}
              currency={cheapestPackage.currency}
            />
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Available Trip Packages ({results.packages.length})
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {results.packages.map((pkg) => {
                const aiRec = results.aiSummary?.recommendations.find(
                  (rec) => rec.packageId === pkg.id
                );
                return (
                  <TripResultCard
                    key={pkg.id}
                    package_={pkg}
                    aiExplanation={aiRec?.explanation}
                    onSaveTrip={() => handleSaveTrip(pkg)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!isLoading && !results && !error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Enter your trip details above to get started
          </p>
        </div>
      )}
    </div>
  );
}
