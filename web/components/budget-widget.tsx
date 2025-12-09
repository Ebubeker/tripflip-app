"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, DollarSign } from "lucide-react";

interface BudgetWidgetProps {
  budget: number;
  currentCost: number;
  currency: string;
}

export function BudgetWidget({ budget, currentCost, currency }: BudgetWidgetProps) {
  const percentUsed = (currentCost / budget) * 100;
  const remaining = budget - currentCost;
  const isOverBudget = currentCost > budget;

  return (
    <Card className={isOverBudget ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className={`h-5 w-5 ${isOverBudget ? "text-red-600" : "text-green-600"}`} />
          Budget Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Budget</span>
            <span className="font-bold">
              {currency} {budget.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Current Cost</span>
            <span className={`font-bold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
              {currency} {currentCost.toFixed(2)}
            </span>
          </div>

          {/* Simple progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${isOverBudget ? "bg-red-600" : "bg-green-600"}`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-sm mt-2">
            <span className={`font-medium ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
              {isOverBudget ? "Over Budget" : "Remaining"}
            </span>
            <div className="flex items-center gap-1">
              {isOverBudget ? (
                <TrendingUp className="h-4 w-4 text-red-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
              <span className={`font-bold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                {currency} {Math.abs(remaining).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {isOverBudget && (
          <div className="text-xs text-red-700 bg-red-100 p-2 rounded">
            This trip exceeds your budget by {currency} {Math.abs(remaining).toFixed(2)}. Consider choosing a cheaper option.
          </div>
        )}

        {!isOverBudget && remaining < budget * 0.2 && (
          <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
            You're using {percentUsed.toFixed(0)}% of your budget. You have {currency} {remaining.toFixed(2)} remaining.
          </div>
        )}

        {!isOverBudget && remaining >= budget * 0.2 && (
          <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
            Great! You're {percentUsed.toFixed(0)}% within budget with {currency} {remaining.toFixed(2)} to spare.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
