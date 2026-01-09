import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Award, TrendingUp, Video, GraduationCap, LayoutDashboard, LogOut, Settings, CreditCard, DollarSign, RefreshCw } from "lucide-react";
import { Link, useLocation } from "wouter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

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
              <Link href="/toggle-role">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-500/20 border-blue-400/30 text-primary-foreground hover:bg-blue-500/30"
                  title={user?.role === 'admin' ? "Switch to Student View" : "Switch to Admin View"}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">{user?.role === 'admin' ? 'Student View' : 'Admin View'}</span>
                </Button>
              </Link>
              <div className="text-right hidden sm:block ml-2">
                <p className="font-semibold text-sm">{user?.name || "Student"}</p>
                <p className="text-xs text-primary-foreground/70">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
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
