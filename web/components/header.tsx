import { Plane } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">TripFlip</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Find your perfect trip in seconds
        </p>
      </div>
    </header>
  );
}
