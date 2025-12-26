import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Send,
  MessageSquare,
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subject: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create email body
      const emailBody = `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
      const mailtoLink = `mailto:support@crosslifeschoolofdivinity.org?subject=${encodeURIComponent(`Contact Form: ${formData.subject}`)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success message
      setTimeout(() => {
        toast({
          title: "Email Client Opened",
          description: "Your email client has opened. Please send the message to complete your inquiry. We'll respond within 1-2 business days.",
        });
      }, 500);
      
      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="accreditation" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-white/90">
              Have questions about enrollment, verification, refunds, or our programs? We're here to help. Send us a message and we'll respond within 1-2 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:support@crosslifeschoolofdivinity.org" className="text-primary hover:underline text-sm">
                      support@crosslifeschoolofdivinity.org
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">Response within 1-2 business days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:312-300-3295" className="text-primary hover:underline text-sm">
                      (312) 300-3295
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">Monday - Friday, 9am - 5pm CST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Response Time</h3>
                    <p className="text-sm">We typically respond to all inquiries within 1-2 business days</p>
                    <p className="text-xs text-muted-foreground mt-2">Urgent matters may be prioritized</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MessageSquare className="h-6 w-6 text-primary" />
                Send Us a Message
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(312) 555-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={handleSubjectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enrollment">Enrollment Question</SelectItem>
                      <SelectItem value="verification">Enrollment Verification</SelectItem>
                      <SelectItem value="refund">Refund Request</SelectItem>
                      <SelectItem value="financial-aid">Financial Aid</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="accreditation">Accreditation</SelectItem>
                      <SelectItem value="chaplaincy">Chaplaincy Training</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please provide details about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Please be as detailed as possible. Include your enrollment ID if you have one.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg">How quickly will I receive a response?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We aim to respond to all inquiries within 1-2 business days. During peak enrollment periods, responses may take up to 3 business days. Urgent matters related to technical issues or payment problems may be prioritized.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg">What if I need immediate help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  For urgent matters, please call us directly at <a href="tel:312-300-3295" className="text-primary hover:underline">(312) 300-3295</a> during business hours (Monday - Friday, 9am - 5pm CST). You can also email us at <a href="mailto:support@crosslifeschoolofdivinity.org" className="text-primary hover:underline">support@crosslifeschoolofdivinity.org</a> with "URGENT" in the subject line.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg">What information should I include in my message?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Please include as much relevant information as possible:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Your enrollment ID (if applicable)</li>
                  <li>Course name or ID</li>
                  <li>A detailed description of your issue or question</li>
                  <li>Any relevant dates or screenshots</li>
                  <li>Your preferred contact method</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg">Can I contact specific departments?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Yes! Use the subject line to direct your inquiry:
                </p>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li><strong>Enrollment & Verification:</strong> accreditation@crosslifeschoolofdivinity.org</li>
                  <li><strong>Financial Aid & Refunds:</strong> financialaid@crosslifeschoolofdivinity.org</li>
                  <li><strong>General Support:</strong> support@crosslifeschoolofdivinity.org</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg">Is my personal information secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, absolutely. All information submitted through this contact form is handled securely. We never share your personal information with third parties and only use it to respond to your inquiry. See our privacy policy for more details.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg">What if I don't receive a response?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you don't receive a response within 3 business days, please check your spam folder. If you still haven't heard from us, please call us at <a href="tel:312-300-3295" className="text-primary hover:underline">(312) 300-3295</a> or try emailing again with "FOLLOW-UP" in the subject line.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="border-2 border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">We're Here to Help</h3>
                  <p className="text-muted-foreground">
                    Whether you have questions about enrollment verification, refunds, financial aid, or any other aspect of your theological education at Cross Life School of Divinity, our support team is ready to assist. Don't hesitate to reach out—we want to make your learning experience as smooth as possible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
