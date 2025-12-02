import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { GraduationCap, LayoutDashboard, LogOut, Settings, Shield } from "lucide-react";
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
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-sm">{user?.name || "Student"}</p>
                <p className="text-xs text-primary-foreground/70">{user?.email}</p>
              </div>
              <Link href="/account-security">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Shield className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Security</span>
                </Button>
              </Link>
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
