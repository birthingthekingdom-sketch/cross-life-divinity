import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Award, Quote, Star, Menu, X, MapPin, Briefcase } from "lucide-react";
import { useState } from "react";

export default function SuccessStories() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stories = [
    {
      name: "Pastor James Mitchell",
      role: "Senior Pastor",
      church: "Grace Community Church",
      location: "Atlanta, Georgia, USA",
      image: "/success-james.jpg",
      coursesCompleted: ["Systematic Theology", "Homiletics", "Biblical Hermeneutics"],
      story: "The Systematic Theology course completely transformed my preaching. I went from surface-level sermons to deep, theologically rich messages that challenge and inspire my congregation. The depth of content combined with practical application has equipped me to teach with greater confidence and clarity. My church has grown spiritually and numerically since implementing what I learned.",
      impact: "Congregation grew from 150 to 400 members in 18 months",
      rating: 5
    },
    {
      name: "Sarah Thompson",
      role: "Worship Leader & Ministry Coordinator",
      church: "New Life Fellowship",
      location: "London, United Kingdom",
      image: "/success-sarah.jpg",
      coursesCompleted: ["Fivefold Ministry", "Biblical Worship", "Spiritual Formation"],
      story: "As a worship leader, the Fivefold Ministry course opened my eyes to my calling and how to operate in my gifts effectively. I learned that worship leading is more than music—it's about shepherding people into God's presence. The flexible schedule allowed me to study while serving full-time in ministry. This platform is a game-changer for busy ministry leaders!",
      impact: "Launched three new worship teams and a school of worship",
      rating: 5
    },
    {
      name: "Rev. David Okonkwo",
      role: "Missionary & Church Planter",
      church: "Kingdom Harvest Ministries",
      location: "Lagos, Nigeria",
      image: "/success-david.jpg",
      coursesCompleted: ["Biblical Hermeneutics", "Evangelism", "Church Administration"],
      story: "The Biblical Hermeneutics course equipped me with tools I use daily in sermon preparation and Bible study leadership. As a church planter in Nigeria, I needed solid theological training that was affordable and accessible. The CPD accreditation adds credibility to my ministry credentials. Worth every penny—actually, the subscription model makes it incredibly affordable!",
      impact: "Planted 5 churches across Nigeria with 2,000+ members combined",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Youth Pastor",
      church: "Vida Nueva Church",
      location: "Mexico City, Mexico",
      image: "/success-maria.jpg",
      coursesCompleted: ["Discipleship Training", "Christian Leadership", "Apologetics"],
      story: "The Apologetics course gave me the confidence to address tough questions from my youth group. Many of them were struggling with doubts and challenges from their secular university environment. Now I can provide solid, biblical answers that strengthen their faith. The course content is relevant, engaging, and immediately applicable to real-world ministry situations.",
      impact: "Youth group doubled in size, 40+ students baptized",
      rating: 5
    },
    {
      name: "Pastor John Kim",
      role: "Lead Pastor",
      church: "Hope City Church",
      location: "Seoul, South Korea",
      image: "/success-john.jpg",
      coursesCompleted: ["Old Testament Survey", "New Testament Survey", "Church History"],
      story: "I completed the entire Biblical Studies learning path while pastoring a growing church. The structured curriculum took me from foundational knowledge to advanced theological understanding. The video lessons were excellent, and the assignments challenged me to apply what I learned. I now preach with greater biblical depth and historical context.",
      impact: "Established a Bible college training 50+ ministry students annually",
      rating: 5
    },
    {
      name: "Rev. Grace Adeyemi",
      role: "Chaplain & Counselor",
      church: "Faith Hospital Chaplaincy",
      location: "Nairobi, Kenya",
      image: "/success-grace.jpg",
      coursesCompleted: ["Pastoral Counseling", "Prayer & Intercession", "Deliverance Ministry"],
      story: "The Pastoral Counseling and Deliverance Ministry courses transformed my chaplaincy work. I now have biblical frameworks for addressing spiritual, emotional, and psychological needs. The practical tools I learned help me minister effectively to patients and families facing crisis situations. This training has made me a more compassionate and effective minister.",
      impact: "Trained 30+ hospital chaplains, established prayer ministry",
      rating: 5
    },
    {
      name: "Pastor Michael Chen",
      role: "Church Planter",
      church: "Living Waters Church",
      location: "Singapore",
      image: "/success-michael.jpg",
      coursesCompleted: ["Christian Leadership", "Church Administration", "Evangelism"],
      story: "As a first-time church planter, I needed practical ministry training fast. The Church Administration course taught me systems and structures that have kept our church organized and growing. The Leadership course helped me develop a strong team of volunteers. Within two years, we've grown from a living room Bible study to a thriving congregation of 250 people.",
      impact: "Church plant grew to 250 members in 2 years, launched 3 satellite campuses",
      rating: 5
    },
    {
      name: "Dr. Rachel Foster",
      role: "Seminary Professor",
      church: "Kingdom Theological Seminary",
      location: "Toronto, Canada",
      image: "/success-rachel.jpg",
      coursesCompleted: ["Systematic Theology", "Homiletics", "Understanding Prophecy"],
      story: "Even as a seminary professor, I found tremendous value in these courses. The content is academically rigorous yet accessible. I've incorporated several teaching methods and resources from CLSOD into my own seminary classes. The Understanding Prophecy course provided fresh insights that enriched my doctoral research. Highly recommend for both students and educators!",
      impact: "Integrated CLSOD curriculum into seminary program, 100+ students enrolled",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Award className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-primary">Cross Life School of Divinity</span>
              </div>
            </Link>
            
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
              <Link href="/faculty" className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium">
                Faculty
              </Link>
              <Link href="/success-stories" className="text-primary font-semibold cursor-pointer">
                Success Stories
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium">
                About
              </Link>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="hidden md:flex items-center gap-3">
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

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-white">
              <div className="py-4 space-y-2">
                <Link href="/catalog">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Courses
                  </div>
                </Link>
                <Link href="/learning-paths">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Learning Paths
                  </div>
                </Link>
                <Link href="/pricing">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Pricing
                  </div>
                </Link>
                <Link href="/faculty">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Faculty
                  </div>
                </Link>
                <Link href="/success-stories">
                  <div className="px-4 py-2 bg-accent/10 text-primary font-semibold cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                    Success Stories
                  </div>
                </Link>
                <Link href="/about">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    About
                  </div>
                </Link>
                <Link href="/faq">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    FAQ
                  </div>
                </Link>
                <div className="px-4 pt-4 pb-2 border-t border-border space-y-2">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-primary hover:bg-primary/90 font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-accent to-accent/80 text-white py-20">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Student Success Stories</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Real testimonies from ministry leaders whose lives and ministries have been transformed through our courses
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-white/90">
            <div className="text-center">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-sm">Students Enrolled</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">50+</div>
              <div className="text-sm">Countries Represented</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">98%</div>
              <div className="text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0">
                    <Award className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{story.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{story.role}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{story.church}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{story.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <div className="relative mb-6">
                  <Quote className="h-8 w-8 text-accent/20 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground leading-relaxed pl-6 italic">
                    "{story.story}"
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-accent/5 border-l-4 border-accent p-3 rounded">
                    <div className="text-sm font-semibold text-accent mb-1">Impact</div>
                    <div className="text-sm text-muted-foreground">{story.impact}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold mb-2">Courses Completed:</div>
                    <div className="flex flex-wrap gap-2">
                      {story.coursesCompleted.map((course, idx) => (
                        <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Your Success Story Starts Here</h2>
          <p className="text-xl text-white/90 mb-8">
            Join ministry leaders worldwide who are transforming their ministries through biblical excellence
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/catalog">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
