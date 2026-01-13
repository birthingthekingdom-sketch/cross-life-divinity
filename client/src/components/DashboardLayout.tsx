import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Award, TrendingUp, Video, GraduationCap, LayoutDashboard, LogOut, Settings, CreditCard, DollarSign, RefreshCw, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "My Courses", icon: LayoutDashboard },
    ...(user?.role === 'admin' ? [{ href: "/admin", label: "Admin", icon: Settings }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Top Navigation */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
        <div className="container py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img 
                src="/logo.png" 
                alt="Cross Life School of Divinity" 
                className="h-12 w-12 object-contain filter brightness-0 invert"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <div>
                <h1 className="text-xl font-bold">Cross Life School of Divinity</h1>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              {/* Quick Navigation Buttons */}
              <Link href="/webinars">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hidden md:flex"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Webinars
                </Button>
              </Link>
              <Link href="/calendar">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hidden md:flex"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </Link>
              <Link href="/progress">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hidden md:flex"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  My Progress
                </Button>
              </Link>
              <Link href="/certificates">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hidden md:flex"
                >
                  <Award className="h-4 w-4 mr-2" />
                  My Certificates
                </Button>
              </Link>
              <Link href="/subscription">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hidden lg:flex"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Subscription
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-amber-500/20 border-amber-400/30 text-primary-foreground hover:bg-amber-500/30 hidden lg:flex"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pricing
                </Button>
              </Link>
              
              {/* User Menu Dropdown */}
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-right hidden sm:block">
                        <p className="font-semibold text-sm">{user?.name || "Student"}</p>
                        <p className="text-xs text-primary-foreground/70 capitalize">{user?.role}</p>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-semibold">{user?.name || "Student"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-1">Role: {user?.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/toggle-role" className="cursor-pointer flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Switch to {user?.role === 'admin' ? 'Student' : 'Admin'} View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container">
          <nav className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
}
