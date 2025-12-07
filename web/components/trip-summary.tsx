import { AISummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface TripSummaryProps {
  summary: AISummary;
}

export function TripSummary({ summary }: TripSummaryProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg mb-2 text-blue-900">
              AI Travel Assistant
            </h3>
            <p className="text-gray-700 leading-relaxed">{summary.overview}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
