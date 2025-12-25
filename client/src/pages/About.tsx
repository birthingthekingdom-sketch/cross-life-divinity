import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { Award, BookOpen, Users, Target, Heart, Globe, ArrowRight } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="about" />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">About Cross Life School of Divinity</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Equipping ministry leaders with seminary-quality theological education that's accessible, affordable, and accredited.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  To provide high-quality, CLAC-accredited theological education that empowers ministry leaders worldwide to deepen their biblical knowledge, strengthen their ministry skills, and transform their communities through the gospel of Jesus Christ.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  To be the leading online platform for accessible theological education, raising up a generation of biblically-grounded, Spirit-led ministry leaders who will advance the Kingdom of God in every sphere of society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Biblical Excellence</h3>
              <p className="text-muted-foreground">
                We are committed to sound biblical teaching rooted in orthodox Christian theology and the authority of Scripture.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Accessibility</h3>
              <p className="text-muted-foreground">
                Quality theological education should be available to everyone, regardless of location or financial constraints.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Global Impact</h3>
              <p className="text-muted-foreground">
                We equip leaders to make a lasting impact in their local churches, communities, and nations for Christ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <Award className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-4xl font-bold mb-6">CLAC Accreditation</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                All our courses are accredited by the Cross Life Accreditation Council (CLAC), our internal accrediting body that maintains rigorous standards equivalent to nationally recognized accrediting agencies.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Upon successful completion of each course, you'll receive a CLAC-accredited certificate that demonstrates your commitment to theological excellence and ministry preparation.
              </p>
              <Link href="/accreditation">
                <Button variant="outline" className="mt-2">
                  Learn More About Our Accreditation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-12 text-center">
              <Award className="h-24 w-24 text-primary mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">CLAC Certified</h3>
              <p className="text-xl text-muted-foreground mb-6">
                Recognized by churches and ministries worldwide
              </p>
              <div className="text-4xl font-bold text-primary mb-2">17 Courses</div>
              <div className="text-lg text-muted-foreground">All CLAC-Accredited</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-accent/5">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Cross Life School of Divinity?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-3">Seminary-Quality Education</h3>
                <p className="text-foreground/80">
                  Our courses are developed by experienced theologians and ministry leaders, providing the same depth and rigor as traditional seminary programs.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-3">Study at Your Own Pace</h3>
                <p className="text-foreground/80">
                  Access courses 24/7 from anywhere in the world. Learn on your schedule, whether you're a full-time minister or balancing work and family.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-3">Affordable Pricing</h3>
                <p className="text-foreground/80">
                  At just $49/month for unlimited access to all courses, quality theological education has never been more affordable.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-3">Practical Application</h3>
                <p className="text-foreground/80">
                  Every course includes practical assignments and real-world applications to help you immediately implement what you learn in your ministry.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Ministry?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join other ministry leaders who are deepening their biblical knowledge and strengthening their ministry impact.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Get Started Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/catalog">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6">
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
