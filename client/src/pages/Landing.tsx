import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Check, BookOpen, Award, Users, Clock } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Award className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-primary">Cross Life School of Divinity</span>
              </div>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/catalog" className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium">
                Courses
              </Link>
              <Link href="/learning-paths" className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium">
                Learning Paths
              </Link>
              <Link href="/pricing" className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium">
                Pricing
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium">
                About
              </Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
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
        </div>
      </nav>
      
      {/* Hero Section with Promotional Image */}
      <section className="relative h-[500px] overflow-hidden">
        <img 
          src="/promo-hero.png" 
          alt="Study Theology at Your Own Pace" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Transform Your Ministry Through Biblical Excellence
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                CPD-accredited courses designed for ministry leaders. Study at your own pace with expert instruction.
              </p>
              <div className="flex gap-4">
                <Link href="/pricing">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6">
                    View Pricing
                  </Button>
                </Link>
                <Link href="/catalog">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                    Course Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Highlight Section */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/promo-pricing.png" 
                alt="$49/Month All-Access Subscription" 
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div>
              <div className="mb-4">
                <Badge className="bg-red-500 text-white hover:bg-red-600 mb-3">
                  <Clock className="w-3 h-3 mr-1" />
                  Limited-Time Offer
                </Badge>
              </div>
              <h2 className="text-4xl font-bold mb-6">All-Access Subscription</h2>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl text-muted-foreground line-through">$79</span>
                <div className="text-5xl font-bold text-accent">$49<span className="text-2xl text-muted-foreground">/month</span></div>
              </div>
              <p className="text-green-600 font-semibold mb-4">Save $30/month - Lock in this rate forever!</p>
              <p className="text-xl text-muted-foreground mb-6">
                Get unlimited access to all 17 seminary-quality courses with one affordable subscription
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg">Unlimited access to all courses and lessons</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg">CPD-accredited certificates upon completion</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg">New courses added regularly</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg">Study at your own pace, anytime, anywhere</span>
                </li>
              </ul>
              <Link href="/pricing">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Courses Highlight */}
      <section className="py-16 bg-accent/5">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">New Courses Added</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">Expand your ministry with our latest seminary-quality courses</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Understanding Prophecy</h3>
              <p className="text-muted-foreground mb-4">
                Explore the prophetic office and gift, learn to test prophecies, and understand the role of prophecy in the believer's life and church ministry.
              </p>
              <div className="text-sm text-accent font-semibold">10 Comprehensive Lessons • 20 CPD Hours</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Deliverance Ministry</h3>
              <p className="text-muted-foreground mb-4">
                Master the biblical foundations of deliverance, understand spiritual and natural bondages, and learn practical methods for setting captives free.
              </p>
              <div className="text-sm text-accent font-semibold">10 Comprehensive Lessons • 20 CPD Hours</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">The Fivefold Ministry</h3>
              <p className="text-muted-foreground mb-4">
                Study the five ministry gifts from Ephesians 4:11 - apostle, prophet, evangelist, pastor, and teacher - and their function in building the church.
              </p>
              <div className="text-sm text-accent font-semibold">10 Comprehensive Lessons • 20 CPD Hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Structured Learning Paths</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow our expertly designed learning paths that guide you from foundational knowledge to advanced theological mastery
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Beginner Path */}
            <div className="bg-card border-2 border-blue-500/20 rounded-lg p-8 hover:shadow-xl transition-all hover:border-blue-500/40">
              <div className="bg-blue-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Beginner</span>
                <h3 className="text-2xl font-bold mt-1">New Believer Foundation</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Perfect for new believers and those seeking to establish a solid biblical foundation. This path introduces essential Christian doctrines, biblical interpretation basics, foundational spiritual disciplines, and practical tools for spiritual growth and discipleship.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm"><strong>Duration:</strong> 5-6 months at recommended pace</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm"><strong>Courses:</strong> Introduction to Theology, Biblical Hermeneutics, Christian Ethics, Prayer & Intercession, Spiritual Warfare, Evangelism</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm"><strong>Ideal For:</strong> New Christians, seekers, and those wanting to strengthen their faith foundation</span>
                </div>
              </div>
              <Link href="/learning-paths">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Beginner Path</Button>
              </Link>
            </div>

            {/* Intermediate Path */}
            <div className="bg-card border-2 border-purple-500/20 rounded-lg p-8 hover:shadow-xl transition-all hover:border-purple-500/40">
              <div className="bg-purple-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Intermediate</span>
                <h3 className="text-2xl font-bold mt-1">Ministry Preparation Track</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Designed for aspiring ministry leaders and those actively serving in church roles. This comprehensive path equips you with practical ministry skills, deeper biblical knowledge, and leadership principles essential for effective kingdom service.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm"><strong>Duration:</strong> 6-8 months at recommended pace</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm"><strong>Courses:</strong> Christian Leadership, Fivefold Ministry, Prayer & Intercession, Church Administration</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm"><strong>Ideal For:</strong> Emerging leaders, small group facilitators, worship team members, and ministry volunteers</span>
                </div>
              </div>
              <Link href="/learning-paths">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Explore Ministry Track</Button>
              </Link>
            </div>

            {/* Advanced Path */}
            <div className="bg-card border-2 border-amber-500/20 rounded-lg p-8 hover:shadow-xl transition-all hover:border-amber-500/40">
              <div className="bg-amber-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Advanced</span>
                <h3 className="text-2xl font-bold mt-1">Theological Studies</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                For seasoned ministry leaders and scholars pursuing theological depth. This rigorous path covers systematic theology, advanced biblical studies, and specialized ministry topics that prepare you for senior leadership and teaching roles in the church.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm"><strong>Duration:</strong> 8-12 months at recommended pace</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm"><strong>Courses:</strong> Systematic Theology, Old & New Testament Survey, Deliverance Ministry, Understanding Prophecy</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm"><strong>Ideal For:</strong> Pastors, teachers, ministry directors, and those pursuing formal theological education</span>
                </div>
              </div>
              <Link href="/learning-paths">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Explore Advanced Path</Button>
              </Link>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Each learning path includes progress tracking, completion certificates, and personalized recommendations
            </p>
            <Link href="/catalog">
              <Button variant="outline" size="lg">View All Courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Cross Life School of Divinity?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-block bg-accent/10 p-4 rounded-full mb-4">
                <BookOpen className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Seminary-Quality Education</h3>
              <p className="text-muted-foreground">
                Comprehensive courses developed by experienced theologians and ministry leaders
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block bg-accent/10 p-4 rounded-full mb-4">
                <Award className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">CPD Accredited</h3>
              <p className="text-muted-foreground">
                Earn recognized certificates that demonstrate your commitment to professional development
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block bg-accent/10 p-4 rounded-full mb-4">
                <Users className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Join Thousands of Leaders</h3>
              <p className="text-muted-foreground">
                Connect with a global community of ministry leaders pursuing excellence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-accent/5">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">What Our Students Say</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">Hear from ministry leaders who have transformed their understanding and impact</p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Pastor James Mitchell</h4>
                  <p className="text-sm text-muted-foreground">Senior Pastor, Grace Community Church</p>
                </div>
              </div>
              <p className="text-muted-foreground italic leading-relaxed">
                "The Systematic Theology course completely transformed my preaching. The depth of content combined with practical application has equipped me to teach with greater confidence and clarity. Highly recommend for any pastor seeking theological excellence."
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Sarah Thompson</h4>
                  <p className="text-sm text-muted-foreground">Worship Leader & Ministry Coordinator</p>
                </div>
              </div>
              <p className="text-muted-foreground italic leading-relaxed">
                "As a worship leader, the Fivefold Ministry course opened my eyes to my calling and how to operate in my gifts. The flexible schedule allowed me to study while serving full-time in ministry. This platform is a game-changer for busy ministry leaders!"
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Rev. David Okonkwo</h4>
                  <p className="text-sm text-muted-foreground">Missionary & Church Planter, Nigeria</p>
                </div>
              </div>
              <p className="text-muted-foreground italic leading-relaxed">
                "The Biblical Hermeneutics course equipped me with tools I use daily in sermon preparation and Bible study leadership. The CPD accreditation adds credibility to my ministry credentials. Worth every penny—actually, the subscription model makes it incredibly affordable!"
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Join 500+ ministry leaders already enrolled in our courses
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-accent hover:bg-accent/90">Start Your Journey Today</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join ministry leaders worldwide who are deepening their faith and expanding their impact
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/70">
            Start with individual courses at $89 each or subscribe for unlimited access at $49/month
          </p>
        </div>
      </section>
    </div>
  );
}
