import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Award, Menu, X, ShieldCheck } from "lucide-react";

interface PublicNavProps {
  currentPage?: "home" | "courses" | "learning-paths" | "pricing" | "about" | "accreditation" | "credits" | "financial-aid" | "prior-learning" | "enrollment-verification" | "refund-policy" | "contact" | "knowledge-base";
}

export function PublicNav({ currentPage }: PublicNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", key: "home" },
    { href: "/catalog", label: "Courses", key: "courses" },
    { href: "/gospel-studies", label: "Gospel Studies", key: "gospel-studies" },
    { href: "/learning-paths", label: "Learning Paths", key: "learning-paths" },
    { href: "/comparison", label: "Compare Plans", key: "comparison" },
    { href: "/about", label: "About", key: "about" },
    { href: "/accreditation", label: "Accreditation", key: "accreditation", icon: true },
    { href: "/credits", label: "Credits", key: "credits", icon: true },
    { href: "/prior-learning", label: "Life Experience", key: "prior-learning", icon: true },
    { href: "/financial-aid", label: "Financial Aid", key: "financial-aid" },
    { href: "/enrollment-verification", label: "Enrollment Verification", key: "enrollment-verification" },
    { href: "/refund-policy", label: "Refund Policy", key: "refund-policy" },
    { href: "/contact", label: "Contact", key: "contact" },
    { href: "/knowledge-base", label: "Help Center", key: "knowledge-base" },
    { href: "/pricing", label: "Pricing", key: "pricing" },
  ];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 py-2 gap-4">
          {/* Logo with Text */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
              <img src="/logo.png" alt="Cross Life School of Divinity" className="h-14 w-14 object-contain" />
              <span className="text-sm font-bold text-primary hidden sm:inline whitespace-nowrap">Cross Life School of Divinity</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3 flex-1 justify-center px-4">
            {navLinks.slice(1, 6).map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`transition-colors cursor-pointer font-medium flex items-center gap-1 text-sm ${
                  currentPage === link.key
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.icon && <ShieldCheck className="h-3 w-3 text-accent" />}
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              <Link href="/login">
                <Button variant="ghost" className="text-xs">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="text-xs">Sign Up</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-3">
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors cursor-pointer font-medium ${
                  currentPage === link.key
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon && <ShieldCheck className="h-4 w-4 text-accent" />}
                {link.label}
              </Link>
            ))}
            <Link href="/login">
              <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                Login
              </div>
            </Link>
            <Link href="/register">
              <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
