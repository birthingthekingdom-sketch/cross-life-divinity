import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Award, Download, FileText, BookOpen, Video, Menu, X, Book, Headphones } from "lucide-react";
import { useState } from "react";

export default function Resources() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const resourceCategories = [
    {
      title: "Study Guides & Templates",
      icon: FileText,
      description: "Downloadable study guides, note-taking templates, and course outlines",
      resources: [
        { name: "Biblical Study Method Guide", type: "PDF", size: "2.5 MB" },
        { name: "Sermon Preparation Template", type: "DOCX", size: "150 KB" },
        { name: "Theological Research Paper Template", type: "DOCX", size: "200 KB" },
        { name: "Bible Reading Plan (One Year)", type: "PDF", size: "500 KB" },
        { name: "Course Note-Taking Template", type: "PDF", size: "1 MB" }
      ]
    },
    {
      title: "Reading Lists & Bibliographies",
      icon: Book,
      description: "Curated reading lists for each course and theological topic",
      resources: [
        { name: "Systematic Theology Reading List", type: "PDF", size: "800 KB" },
        { name: "Old Testament Commentaries Guide", type: "PDF", size: "1.2 MB" },
        { name: "New Testament Resources Bibliography", type: "PDF", size: "900 KB" },
        { name: "Church History Essential Readings", type: "PDF", size: "1.5 MB" },
        { name: "Leadership Development Book List", type: "PDF", size: "600 KB" }
      ]
    },
    {
      title: "Video Resources",
      icon: Video,
      description: "Supplementary video content and recorded webinars",
      resources: [
        { name: "Introduction to Seminary Studies", type: "Video", size: "45 min" },
        { name: "How to Write a Theological Paper", type: "Video", size: "30 min" },
        { name: "Biblical Greek Pronunciation Guide", type: "Video", size: "20 min" },
        { name: "Effective Bible Study Methods", type: "Video", size: "35 min" },
        { name: "Ministry Leadership Q&A Webinar", type: "Video", size: "60 min" }
      ]
    },
    {
      title: "Audio Lectures & Podcasts",
      icon: Headphones,
      description: "Audio versions of lectures and ministry podcasts",
      resources: [
        { name: "Theology on the Go Podcast Series", type: "MP3", size: "Various" },
        { name: "Church History Audio Lectures", type: "MP3", size: "12 episodes" },
        { name: "Pastoral Wisdom Interviews", type: "MP3", size: "8 episodes" },
        { name: "Biblical Exposition Techniques", type: "MP3", size: "45 min" },
        { name: "Prayer & Spiritual Formation Series", type: "MP3", size: "6 episodes" }
      ]
    },
    {
      title: "Ministry Tools",
      icon: BookOpen,
      description: "Practical tools and resources for ministry leaders",
      resources: [
        { name: "Small Group Discussion Guide Template", type: "DOCX", size: "250 KB" },
        { name: "Church Vision & Mission Worksheet", type: "PDF", size: "400 KB" },
        { name: "Ministry Budget Planning Template", type: "XLSX", size: "300 KB" },
        { name: "Volunteer Recruitment Toolkit", type: "PDF", size: "1.8 MB" },
        { name: "Pastoral Care Visit Checklist", type: "PDF", size: "200 KB" }
      ]
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
              <Link href="/resources" className="text-primary font-semibold cursor-pointer">
                Resources
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
                <Link href="/resources">
                  <div className="px-4 py-2 bg-accent/10 text-primary font-semibold cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                    Resources
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
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Ministry Resources</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Free downloadable resources to support your theological studies and ministry development
          </p>
        </div>
      </section>

      {/* Info Banner */}
      <section className="bg-accent/10 border-y border-accent/20 py-6">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-center">
            <Download className="h-6 w-6 text-accent" />
            <p className="text-lg">
              <strong>All resources are free for enrolled students.</strong> Some resources are available to the public.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="space-y-12">
            {resourceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-card border border-border rounded-lg p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.resources.map((resource, idx) => (
                      <div key={idx} className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{resource.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="bg-accent/10 text-accent px-2 py-0.5 rounded text-xs font-medium">
                                {resource.type}
                              </span>
                              <span>{resource.size}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="flex-shrink-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Resources Section */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Course Syllabi</h3>
              <p className="text-muted-foreground mb-4">
                Detailed course outlines with learning objectives, reading assignments, and assessment criteria
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Academic Policies</h3>
              <p className="text-muted-foreground mb-4">
                Student handbook, academic integrity policy, and CPD accreditation information
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                View Policies
              </Button>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Webinar Recordings</h3>
              <p className="text-muted-foreground mb-4">
                Access past webinars, Q&A sessions, and special lectures from guest speakers
              </p>
              <Link href="/webinars">
                <Button variant="outline" className="w-full">
                  View Webinars
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Get Full Access to All Resources</h2>
          <p className="text-xl text-white/90 mb-8">
            Enroll in our courses to unlock unlimited access to all study materials, templates, and ministry tools
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-accent hover:bg-white/90 text-lg px-8 py-6">
                Create Free Account
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
