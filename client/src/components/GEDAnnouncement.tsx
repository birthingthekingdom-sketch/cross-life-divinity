import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { X, Zap } from "lucide-react";
import { useState } from "react";

export function GEDAnnouncement() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-4 shadow-lg">
      <div className="container max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Zap className="h-5 w-5 flex-shrink-0" />
          <span className="font-semibold text-lg">
            Create an account and GET FREE GED PREP COURSES
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/register">
            <Button 
              size="sm" 
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            >
              Sign Up Free
            </Button>
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close announcement"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
