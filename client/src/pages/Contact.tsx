import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Linkedin,
  Facebook,
  Twitter,
} from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "support@crosslifedivinity.com",
      description: "Response time: 24 hours",
      link: "mailto:support@crosslifedivinity.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "1-800-CLSD-HELP",
      description: "Mon-Fri, 9 AM - 5 PM EST",
      link: "tel:1-800-2573-4357",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      value: "Available 24/7",
      description: "Instant support from our team",
      link: "#",
    },
    {
      icon: MapPin,
      title: "Mailing Address",
      value: "Cross Life School of Divinity",
      description: "Administrative Office",
      link: "#",
    },
  ];

  const departments = [
    {
      name: "Academic Support",
      email: "academics@crosslifedivinity.com",
      hours: "Mon-Fri, 9 AM - 5 PM EST",
      description: "Course content, assignments, and academic questions",
    },
    {
      name: "Technical Support",
      email: "support@crosslifedivinity.com",
      hours: "Mon-Fri, 9 AM - 5 PM EST",
      description: "Login issues, platform problems, and technical help",
    },
    {
      name: "Billing & Enrollment",
      email: "billing@crosslifedivinity.com",
      hours: "Mon-Fri, 9 AM - 5 PM EST",
      description: "Payment, refunds, and enrollment questions",
    },
    {
      name: "Admissions",
      email: "admissions@crosslifedivinity.com",
      hours: "Mon-Fri, 9 AM - 5 PM EST",
      description: "Program information and enrollment assistance",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="contact" />

      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-white/90">
              Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a key={method.title} href={method.link} className="block">
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6 text-center">
                      <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">{method.title}</h3>
                      <p className="text-sm font-medium text-foreground mb-1">{method.value}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitted}>
                  {submitted ? "Message Sent!" : "Send Message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>

                {submitted && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Our Departments</h2>
              <div className="space-y-6">
                {departments.map((dept) => (
                  <Card key={dept.name}>
                    <CardHeader>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href={`mailto:${dept.email}`} className="text-primary hover:underline font-medium">
                          {dept.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Hours</p>
                        <p className="font-medium">{dept.hours}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{dept.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/20">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Connect With Us</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Follow us on social media for updates, resources, and community engagement.
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
