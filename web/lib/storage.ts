import { SavedTrip, UserSettings } from "./types";

// Local storage keys
const TRIPS_KEY = "tripflip_saved_trips";
const SETTINGS_KEY = "tripflip_user_settings";

// Trip management functions
export function saveTripToStorage(trip: SavedTrip): void {
  if (typeof window === "undefined") return;

  const trips = getSavedTrips();
  const existingIndex = trips.findIndex((t) => t.id === trip.id);

  if (existingIndex >= 0) {
    trips[existingIndex] = { ...trip, updatedAt: new Date().toISOString() };
  } else {
    trips.push(trip);
  }

  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

export function getSavedTrips(): SavedTrip[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(TRIPS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading saved trips:", error);
    return [];
  }
}

export function getTripById(id: string): SavedTrip | null {
  const trips = getSavedTrips();
  return trips.find((trip) => trip.id === id) || null;
}

export function deleteTripFromStorage(id: string): void {
  if (typeof window === "undefined") return;

  const trips = getSavedTrips();
  const filtered = trips.filter((trip) => trip.id !== id);
  localStorage.setItem(TRIPS_KEY, JSON.stringify(filtered));
}

// Settings management functions
export function saveSettingsToStorage(settings: UserSettings): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getSettings(): UserSettings {
  if (typeof window === "undefined") {
    return getDefaultSettings();
  }

  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch (error) {
    console.error("Error loading settings:", error);
    return getDefaultSettings();
  }
}

function getDefaultSettings(): UserSettings {
  return {
    travelStyle: "standard",
    preferredActivities: [],
    hotelPreferences: "",
    dreamHotelStyle: "",
  };
}
