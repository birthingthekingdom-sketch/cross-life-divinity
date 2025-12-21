import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/logo.png" 
                alt="Cross Life School of Divinity" 
                className="h-10 w-10 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <h3 className="font-bold text-lg">CLSOD</h3>
            </div>
            <p className="text-white/80 text-sm mb-4">
              CLAC-accredited theological education for ministry leaders. Transform your ministry through biblical excellence.
            </p>
            <Link href="/accreditation" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 rounded-md text-sm">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>CLAC Accredited</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog" className="text-white/80 hover:text-white transition-colors">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link href="/learning-paths" className="text-white/80 hover:text-white transition-colors">
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/accreditation" className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Accreditation
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Resources */}
          <div>
            <h4 className="font-semibold mb-4">Student Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-white/80 hover:text-white transition-colors">
                  My Certificates
                </Link>
              </li>
              <li>
                <Link href="/referrals" className="text-white/80 hover:text-white transition-colors">
                  Referral Program
                </Link>
              </li>
              <li>
                <Link href="/cohorts" className="text-white/80 hover:text-white transition-colors">
                  Study Groups
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@crosslifeschoolofdivinity.org" className="text-white/80 hover:text-white transition-colors">
                  support@crosslifeschoolofdivinity.org
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+13123003295" className="text-white/80 hover:text-white transition-colors">
                  (312) 300-3295
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">
                  Online Education Platform
                </span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80">
          <p>
            © {new Date().getFullYear()} Cross Life School of Divinity. All rights reserved.
          </p>
          <p>
            Powered by <span className="font-semibold text-white">CLSOD</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
