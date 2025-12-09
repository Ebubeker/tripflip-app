import Link from "next/link";
import { Plane, Briefcase, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-pink-600" />
            <div>
              <h1 className="text-2xl font-bold">TripFlip</h1>
              <p className="text-xs text-muted-foreground">
                Find your perfect trip in seconds
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/trips">
              <Button variant="ghost" className="gap-2">
                <Briefcase className="h-4 w-4" />
                My Trips
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
