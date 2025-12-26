import { Home, BookOpen, Award, TrendingUp, Menu } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { isStandalone } from "@/registerSW";

export function MobileNav() {
  const [location, setLocation] = useLocation();
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsInstalled(isStandalone());
    
    // Check if mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only show on mobile and when installed as PWA
  if (!isMobile || !isInstalled) {
    return null;
  }

  // Don't show on home page or admin pages
  if (location === '/' || location.startsWith('/admin') || location.startsWith('/verify')) {
    return null;
  }

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/certificates', icon: Award, label: 'Certificates' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-0 touch-manipulation transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
