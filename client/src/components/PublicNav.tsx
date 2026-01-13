import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Award, Menu, X, ChevronDown } from "lucide-react";

interface PublicNavProps {
  currentPage?: "home" | "courses" | "learning-paths" | "pricing" | "about";
}

export function PublicNav({ currentPage }: PublicNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const mainNavLinks = [
    { href: "/catalog", label: "Courses", key: "courses" },
    { href: "/learning-paths", label: "Learning Paths", key: "learning-paths" },
    { href: "/about", label: "About", key: "about" },
    { href: "/pricing", label: "Pricing", key: "pricing" },
  ];

  const secondaryNavLinks = [
    { href: "/bridge-academy", label: "Bridge Academy (GED Prep)", key: "bridge-academy" },
    { href: "/chaplaincy-training", label: "Chaplaincy Training", key: "chaplaincy" },
    { href: "/accreditation", label: "Accreditation", key: "accreditation" },
    { href: "/credits", label: "Credits & Certification", key: "credits" },
    { href: "/life-experience", label: "Life Experience Credits", key: "life-experience" },
    { href: "/financial-aid", label: "Financial Aid", key: "financial-aid" },
    { href: "/enrollment-verification", label: "Enrollment Verification", key: "enrollment-verification" },
    { href: "/refund-policy", label: "Refund Policy", key: "refund-policy" },
    { href: "/knowledge-base", label: "Help Center", key: "help-center" },
    { href: "/contact", label: "Contact", key: "contact" },
  ];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-24 py-2">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/logo.png" alt="Cross Life School of Divinity" className="h-20 w-20 object-contain" />
              <span className="hidden sm:inline text-lg font-bold text-primary">CLSOD</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {mainNavLinks.map((link) => (
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
            
            {/* Dropdown Menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors">
                More
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {secondaryNavLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent/10 hover:text-primary transition-colors first:rounded-t-md last:rounded-b-md"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

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
            {mainNavLinks.map((link) => (
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
            
            {/* Mobile Dropdown */}
            <div className="px-4">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between py-2 font-medium text-foreground hover:text-primary transition-colors"
              >
                More
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="space-y-2 mt-2 pl-4 border-l-2 border-primary/20">
                  {secondaryNavLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      className="block py-1 text-sm text-foreground hover:text-primary transition-colors"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setDropdownOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

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
