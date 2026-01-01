import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface BridgeAcademyNavProps {
  currentPage?: 'overview' | 'details' | 'materials' | 'dashboard';
}

export function BridgeAcademyNav({ currentPage = 'overview' }: BridgeAcademyNavProps) {
  const [location] = useLocation();

  const navItems = [
    { id: 'overview', label: 'Overview', href: '/bridge-academy' },
    { id: 'details', label: 'Details', href: '/bridge-academy/details' },
    { id: 'materials', label: 'Study Materials', href: '/bridge-academy/study-materials' },
    { id: 'dashboard', label: 'Progress Dashboard', href: '/bridge-academy/dashboard' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="container max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/courses">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to CLSOD
            </Button>
          </Link>
          <div className="text-sm font-semibold text-primary">Bridge Academy - GED Preparation</div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <Button
                variant={currentPage === item.id ? 'default' : 'outline'}
                size="sm"
                className="text-sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
