"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSettings, saveSettingsToStorage } from "@/lib/storage";
import { UserSettings } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [saved, setSaved] = useState(false);

  const activityOptions = [
    "Museums & Culture",
    "Food & Dining",
    "Shopping",
    "Nightlife",
    "Nature & Hiking",
    "Beach & Water Sports",
    "Adventure Sports",
    "Historical Sites",
    "Local Markets",
    "Photography",
  ];

  const handleSave = () => {
    saveSettingsToStorage(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleActivity = (activity: string) => {
    const newActivities = settings.preferredActivities.includes(activity)
      ? settings.preferredActivities.filter((a) => a !== activity)
      : [...settings.preferredActivities, activity];
    setSettings({ ...settings, preferredActivities: newActivities });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-pink-600" />
          Travel Preferences
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize your travel experience and get personalized recommendations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Travel Style</CardTitle>
          <CardDescription>
            Choose your preferred travel style to get better recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="travelStyle">Preferred Style</Label>
            <Select
              value={settings.travelStyle}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  travelStyle: value as "budget" | "standard" | "luxury",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">
                  Budget - Focus on affordable options
                </SelectItem>
                <SelectItem value="standard">
                  Standard - Balance of comfort and price
                </SelectItem>
                <SelectItem value="luxury">
                  Luxury - Premium experiences and comfort
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferred Activities</CardTitle>
          <CardDescription>
            Select activities you enjoy while traveling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {activityOptions.map((activity) => (
              <Button
                key={activity}
                variant={
                  settings.preferredActivities.includes(activity)
                    ? "default"
                    : "outline"
                }
                onClick={() => toggleActivity(activity)}
                className={
                  settings.preferredActivities.includes(activity)
                    ? "bg-pink-600 hover:bg-pink-700"
                    : ""
                }
              >
                {activity}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hotel Preferences</CardTitle>
          <CardDescription>
            Tell us about your ideal accommodation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotelPreferences">Hotel Preferences</Label>
            <Input
              id="hotelPreferences"
              placeholder="e.g., Close to city center, pool required, family-friendly"
              value={settings.hotelPreferences}
              onChange={(e) =>
                setSettings({ ...settings, hotelPreferences: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dreamHotelStyle">Dream Hotel Style (Optional)</Label>
            <Input
              id="dreamHotelStyle"
              placeholder="e.g., Boutique hotel with modern design, historic charm, beachfront resort"
              value={settings.dreamHotelStyle || ""}
              onChange={(e) =>
                setSettings({ ...settings, dreamHotelStyle: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Describe your ideal hotel to help us understand your preferences better
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          className="bg-pink-600 hover:bg-pink-700 gap-2"
          disabled={saved}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Preferences"}
        </Button>
      </div>

      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          ✓ Preferences saved successfully!
        </div>
      )}
    </div>
  );
}
