import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Check, BookOpen, Award, Gift, Users, Clock, Menu, X } from "lucide-react";
import { useState } from "react";

export default function ChristmasGift() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const courses = [
    { code: "BIB101", title: "Old Testament Survey", hours: 40, category: "Biblical Studies" },
    { code: "BIB102", title: "New Testament Survey", hours: 40, category: "Biblical Studies" },
    { code: "BIB103", title: "Biblical Hermeneutics", hours: 40, category: "Biblical Studies" },
    { code: "THE101", title: "Systematic Theology", hours: 40, category: "Theology" },
    { code: "THE301", title: "Fundamentals of Apologetics", hours: 35, category: "Theology" },
    { code: "THE302", title: "Understanding Prophecy", hours: 35, category: "Theology" },
    { code: "MIN101", title: "Evangelism & Discipleship", hours: 35, category: "Ministry Skills" },
    { code: "MIN102", title: "Homiletics", hours: 35, category: "Ministry Skills" },
    { code: "MIN103", title: "Pastoral Leadership", hours: 35, category: "Ministry Skills" },
    { code: "MIN104", title: "Chaplaincy Training", hours: 40, category: "Ministry Skills" },
  ];

  const pricingTiers = [
    {
      name: "Annual Subscription",
      price: 449,
      originalPrice: 599,
      savings: 150,
      duration: "1 year",
      description: "Perfect for leaders wanting a full year of learning",
      features: ["Full access to all 18 courses", "Learning paths included", "CLAC accreditation", "Lifetime access to materials"],
    },
    {
      name: "Lifetime Access",
      price: 899,
      originalPrice: 1299,
      savings: 400,
      duration: "Forever",
      description: "Best value for committed learners",
      features: ["Full access to all courses", "All future updates included", "CLAC accreditation", "Permanent access"],
      featured: true,
    },
    {
      name: "6-Month Subscription",
      price: 249,
      originalPrice: 349,
      savings: 100,
      duration: "6 months",
      description: "Great for trying it out",
      features: ["Full access to all 18 courses", "Learning paths included", "CLAC accreditation", "6-month access"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-24 py-2">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/logo.png" alt="Cross Life School of Divinity" className="h-32 w-32 object-contain" />
                <span className="hidden sm:inline text-xl font-bold text-primary">CLSD</span>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-4 ml-auto">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-white">
              <div className="py-4 space-y-2">
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
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Banner */}
      <section className="relative w-full">
        <img
          src="/christmas-gift-banner.png"
          alt="Bless Your Leaders This Christmas"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bless Your Leaders This Christmas</h1>
            <p className="text-lg md:text-xl mb-8">Give the gift of spiritual growth and biblical knowledge</p>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              Choose Your Gift
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Section 1: The Opportunity */}
        <section className="mb-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-primary">Invest in Your Leaders' Growth</h2>
            <p className="text-lg text-foreground/80 mb-4">
              Your church leaders are the foundation of everything you do. They study, pray, prepare, and shepherd with dedication and love. They deserve to grow.
            </p>
            <p className="text-lg text-foreground/80">
              This Christmas, show your leaders how much you value their service with a gift that will transform their ministry for years to come.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Deep Biblical Knowledge</h3>
              <p className="text-foreground/70">
                Seminary-level education covering Old Testament, New Testament, theology, and ministry skills.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-accent/10 p-4 rounded-lg">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Learning</h3>
              <p className="text-foreground/70">
                Study anytime, anywhere, at their own pace. Perfect for busy leaders balancing multiple responsibilities.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">CLAC Accreditation</h3>
              <p className="text-foreground/70">
                Earn recognized credentials in biblical and theological education. 120+ hours available.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: What's Included */}
        <section className="mb-20 bg-primary/5 rounded-lg p-12">
          <h2 className="text-4xl font-bold mb-12 text-center text-primary">What's Included</h2>

          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8 text-primary">18 Comprehensive Courses</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {courses.map((course) => (
                <div key={course.code} className="flex items-start gap-4">
                  <Check className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-foreground">{course.title}</p>
                    <p className="text-sm text-foreground/60">{course.code} • {course.hours} hours • {course.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-primary">Special Learning Paths</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 border border-border">
                <h4 className="font-bold text-lg mb-2">Gospel Studies Intensive</h4>
                <p className="text-foreground/70">Master the Four Gospels with 80 hours combining Old Testament connections and New Testament Gospel study.</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-border">
                <h4 className="font-bold text-lg mb-2">Leadership Development Path</h4>
                <p className="text-foreground/70">Courses specifically designed for ministry leaders seeking to strengthen their leadership skills and biblical knowledge.</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-border">
                <h4 className="font-bold text-lg mb-2">Theological Mastery Path</h4>
                <p className="text-foreground/70">A deep dive into systematic theology and biblical foundations for leaders wanting comprehensive theological education.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 text-primary">Additional Benefits</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Lifetime access to all course materials",
                "Expert instruction from biblical scholars",
                "Practical assignments with real-world application",
                "Community discussion forums",
                "Access to learning paths and curated content",
                "New courses added regularly",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Perfect For */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-primary">Perfect For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Pastors & Associate Pastors", desc: "Deepen biblical knowledge and strengthen preaching and leadership" },
              { title: "Ministry Directors", desc: "Develop specialized skills and theological foundation" },
              { title: "Sunday School Teachers", desc: "Master Scripture and improve teaching effectiveness" },
              { title: "Chaplains", desc: "Access specialized training and biblical foundations" },
              { title: "Small Group Leaders", desc: "Strengthen biblical teaching and leadership skills" },
              { title: "Anyone in Ministry", desc: "Pursue continuous spiritual growth and development" },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-primary">{item.title}</h3>
                <p className="text-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Pricing */}
        <section id="pricing" className="mb-20">
          <h2 className="text-4xl font-bold mb-4 text-center text-primary">Choose Your Gift</h2>
          <p className="text-center text-foreground/70 mb-12 text-lg">Special Christmas pricing available through December 24</p>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`rounded-lg border-2 overflow-hidden transition-all ${
                  tier.featured
                    ? "border-accent bg-accent/5 shadow-lg scale-105"
                    : "border-border bg-card"
                }`}
              >
                {tier.featured && (
                  <div className="bg-accent text-accent-foreground py-2 px-4 text-center font-bold">
                    Best Value
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm text-foreground/60 mb-6">{tier.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-primary">${tier.price}</span>
                      <span className="text-sm text-foreground/60">/{tier.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm line-through text-foreground/50">${tier.originalPrice}</span>
                      <Badge variant="secondary" className="bg-accent/20 text-accent">
                        Save ${tier.savings}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    className={`w-full mb-6 font-bold ${
                      tier.featured
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                    size="lg"
                  >
                    Give This Gift
                  </Button>

                  <div className="space-y-3">
                    {tier.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary/10 rounded-lg p-8 text-center">
            <Gift className="h-8 w-8 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Digital Gift Certificate Included</h3>
            <p className="text-foreground/70">
              Every gift subscription includes a beautiful digital gift certificate. Recipients can redeem immediately or save for January 1st.
            </p>
          </div>
        </section>

        {/* Section 5: How It Works */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-primary">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Choose Your Gift</h3>
              <p className="text-foreground/70">
                Select the subscription option that's right for your leader (Annual, Lifetime, or 6-Month).
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Complete Purchase</h3>
              <p className="text-foreground/70">
                Provide your payment information and personalize the gift certificate message.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Deliver the Gift</h3>
              <p className="text-foreground/70">
                We'll send you a beautiful digital gift certificate your leader can use immediately or save for later.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white rounded-lg p-12 text-center mb-20">
          <h2 className="text-4xl font-bold mb-6">Give the Gift of Growth This Christmas</h2>
          <p className="text-lg mb-8 opacity-90">
            Your leaders deserve to grow. Show them how much you value their service.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          >
            Choose Your Gift Now
          </Button>
          <p className="text-sm mt-6 opacity-75">Orders placed by December 24 will be delivered by Christmas</p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
