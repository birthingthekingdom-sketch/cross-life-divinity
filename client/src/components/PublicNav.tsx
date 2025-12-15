import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Award, Menu, X } from "lucide-react";

interface PublicNavProps {
  currentPage?: "home" | "courses" | "learning-paths" | "pricing" | "about" | "accreditation";
}

export function PublicNav({ currentPage }: PublicNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", key: "home" },
    { href: "/catalog", label: "Courses", key: "courses" },
    { href: "/learning-paths", label: "Learning Paths", key: "learning-paths" },
    { href: "/pricing", label: "Pricing", key: "pricing" },
    { href: "/about", label: "About", key: "about" },
    { href: "/accreditation", label: "Accreditation", key: "accreditation" },
  ];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-32 py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/logo.png" alt="Cross Life School of Divinity" className="h-48 w-48 object-contain" />
              <span className="text-xl font-bold text-primary">Cross Life School of Divinity</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`transition-colors cursor-pointer font-medium ${
                  currentPage === link.key
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`block py-2 px-4 rounded-md transition-colors cursor-pointer font-medium ${
                  currentPage === link.key
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 px-4 pt-2">
              <Link href="/login">
                <Button variant="ghost" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
