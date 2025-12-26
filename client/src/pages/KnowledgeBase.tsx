import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { useState, useMemo } from "react";
import { Search, ThumbsUp, ThumbsDown, BookOpen, HelpCircle } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: "enrollment" | "verification" | "access" | "certificates" | "payment" | "technical";
  excerpt: string;
  content: string;
  helpful: number;
  unhelpful: number;
}

const articles: Article[] = [
  {
    id: "enroll-1",
    title: "How do I enroll in a course?",
    category: "enrollment",
    excerpt: "Step-by-step guide to enrolling in your first course at Cross Life School of Divinity.",
    content: `To enroll in a course at Cross Life School of Divinity, follow these steps:

1. Log in to your account or create a new one
2. Browse the course catalog or click on a specific course
3. Click the "Enroll" button
4. Select your payment plan (individual course, bundle, or all-access subscription)
5. Complete the enrollment verification process by uploading your ID
6. Receive your access codes immediately
7. Start your courses right away

Your enrollment is not complete until you've verified your identity with a valid government-issued ID. Once verified, you'll have full access to all course materials.`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "enroll-2",
    title: "What payment plans are available?",
    category: "enrollment",
    excerpt: "Learn about the different pricing options for courses and learning paths.",
    content: `Cross Life School of Divinity offers several flexible payment options:

**Individual Courses**: $89 per course
- Pay once, access forever
- No subscription required
- Perfect for exploring specific topics

**3-Course Bundles**: $299
- Save $68 compared to individual courses
- Great for focused learning paths
- One-time payment

**Learning Paths**: $199
- Structured sequences of courses
- Comprehensive theological education
- One-time payment

**All-Access Subscription**: $49/month
- Access to all courses
- Cancel anytime
- Perfect for continuous learners

**Payment Plans**: 6-month payment plans available at 0% interest
- Spread costs over time
- No additional fees
- Flexible scheduling

All payments are processed securely through Stripe. You can upgrade or change your plan anytime.`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "verify-1",
    title: "What ID documents are accepted for verification?",
    category: "verification",
    excerpt: "Information about acceptable forms of identification for enrollment verification.",
    content: `For enrollment verification, Cross Life School of Divinity accepts the following government-issued ID documents:

**Accepted Documents**:
- U.S. Driver's License (state or federal)
- State ID Card (non-driver identification)
- U.S. Passport
- International Driver's License
- International Passport

**Requirements**:
- ID must be current and valid
- Photo must be clear and legible
- Full ID must be visible in the photo
- All information must be readable
- ID must match enrollment information

**What to Do**:
1. Take a clear photo of your ID (front side)
2. Ensure the photo is well-lit and not blurry
3. Upload the photo during enrollment
4. Receive access codes immediately
5. Wait for background verification (2-3 weeks)

If your ID photo is rejected or unclear, our team will contact you to request a resubmission. You can upload an alternative ID at any time.`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "verify-2",
    title: "How long does background verification take?",
    category: "verification",
    excerpt: "Timeline and process for background check verification.",
    content: `Background verification is an important part of our enrollment process to maintain the integrity of our CLAC-accredited programs.

**Standard Verification Timeline**: 2-3 weeks
- Most students receive verification within this timeframe
- You'll receive email updates on your verification status
- You can start courses immediately while verification is pending

**Chaplaincy Training Timeline**: 3-4 weeks
- Enhanced verification required for chaplaincy roles
- Includes reference verification and credential review
- Additional screening due to sensitive nature of the work

**During Verification**:
- Your ID is validated against government records
- Background screening is conducted
- For Chaplaincy: references are contacted and credentials verified
- You can access and complete courses while waiting

**After Verification**:
- You'll receive official enrollment confirmation
- You're eligible to receive CLAC certificates
- Your enrollment status is finalized

**If Issues Arise**:
- Our team will contact you if additional information is needed
- You have time to provide clarification or alternative documentation
- If verification cannot be completed, you'll receive a full refund`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "access-1",
    title: "How do I access my courses after enrollment?",
    category: "access",
    excerpt: "Guide to accessing course materials and lessons.",
    content: `Once you've enrolled and received your access codes, accessing your courses is easy.

**Getting Started**:
1. Log in to your student dashboard
2. Click "My Courses" or "Dashboard"
3. Select the course you want to access
4. Your access codes are automatically applied

**Course Materials**:
- All lessons are available immediately after enrollment
- Video lectures, readings, and resources are in each lesson
- Quizzes and assignments are interactive
- Discussion forums connect you with other students

**Accessing Lessons**:
1. Navigate to your course
2. Click on each lesson to view content
3. Complete quizzes and assignments
4. Track your progress with the progress bar
5. Move to the next lesson when ready

**Technical Requirements**:
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- JavaScript enabled
- Cookies enabled for login persistence

**If You Can't Access**:
- Check your internet connection
- Try a different browser
- Clear your browser cache and cookies
- Contact support@crosslifeschoolofdivinity.org`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "access-2",
    title: "Can I download course materials?",
    category: "access",
    excerpt: "Information about downloading and saving course content.",
    content: `Course materials are designed to be accessed online through our platform. Here's what you need to know about downloading:

**What Can Be Downloaded**:
- Lecture transcripts (where available)
- Reading materials and PDFs
- Resource lists and links
- Your quiz results and grades
- Your certificates (after completion)

**What Cannot Be Downloaded**:
- Video lectures (streaming only)
- Interactive quizzes
- Discussion forum posts (view only)
- Live webinar recordings (available for limited time)

**How to Save Content**:
- Print webpages to PDF using your browser
- Take screenshots of important content
- Copy text and paste into your notes
- Use your browser's "Save As" feature for HTML pages

**Why Streaming Only**:
- Protects intellectual property
- Ensures content quality and updates
- Maintains security and access control
- Supports our accreditation standards

**Offline Access**:
- We recommend taking notes while studying
- Print important materials before your course ends
- Access is available for 1 year after course completion`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "cert-1",
    title: "How do I receive my certificate?",
    category: "certificates",
    excerpt: "Process for earning and receiving CLAC certificates.",
    content: `Upon successful completion of a course, you'll receive a CLAC-accredited certificate. Here's how it works:

**Certificate Requirements**:
- Complete all lessons in the course
- Pass all quizzes (typically 70% or higher)
- Submit any required assignments
- Pass final assessment (if applicable)
- Complete enrollment verification

**Receiving Your Certificate**:
1. Complete all course requirements
2. Your certificate is automatically generated
3. You'll receive an email notification
4. Access your certificate in "My Certificates"
5. Download or print your certificate

**Certificate Details**:
- CLAC-accredited and recognized
- Includes course title and completion date
- Shows CPD hours earned
- Includes your name and verification code
- Professional design suitable for framing

**Verifying Your Certificate**:
- Each certificate has a unique verification code
- Others can verify authenticity on our website
- Use the "Verify Certificate" tool
- Share your verification code with employers

**Digital vs. Physical**:
- Digital certificates are available immediately
- Print your own copy anytime
- Official transcripts available upon request
- Certificates are permanent and non-expiring`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "cert-2",
    title: "Can I get a transcript of my courses?",
    category: "certificates",
    excerpt: "How to request official transcripts and course records.",
    content: `Official transcripts documenting your completed courses and certificates are available upon request.

**Requesting a Transcript**:
1. Log in to your student dashboard
2. Go to "My Certificates" or "Transcripts"
3. Click "Request Official Transcript"
4. Provide recipient information (if mailing)
5. Select delivery method (digital or physical)

**Transcript Contents**:
- All completed courses with dates
- Grades and assessment scores
- CPD hours earned
- Certificate verification codes
- Your enrollment status

**Delivery Options**:
- Digital PDF (instant delivery)
- Email delivery (within 1 business day)
- Official sealed copy (mailed within 5 business days)
- Multiple copies available

**Cost**:
- First digital transcript: Free
- Additional digital transcripts: $5 each
- Official sealed copies: $10 each
- Rush delivery available for additional fee

**Using Your Transcript**:
- Share with employers or other educational institutions
- Document professional development
- Support credential verification
- Maintain your educational record`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "payment-1",
    title: "What payment methods do you accept?",
    category: "payment",
    excerpt: "Accepted payment options and payment security information.",
    content: `Cross Life School of Divinity accepts multiple secure payment methods for your convenience.

**Accepted Payment Methods**:
- Credit Cards: Visa, Mastercard, American Express, Discover
- Debit Cards: All major debit cards
- Digital Wallets: Apple Pay, Google Pay
- Bank Transfers: ACH transfers (US only)
- Payment Plans: 6-month plans at 0% interest

**Payment Security**:
- All payments processed through Stripe (PCI-DSS compliant)
- 256-bit SSL encryption
- Your card information is never stored on our servers
- Secure payment gateway with fraud protection

**Making a Payment**:
1. Select your course or plan
2. Click "Enroll" or "Subscribe"
3. Enter payment information
4. Review order summary
5. Click "Complete Payment"
6. Receive confirmation email

**Payment Confirmation**:
- Instant email receipt
- Order number for reference
- Invoice available in your account
- Access codes sent immediately

**Billing Questions**:
- Contact financialaid@crosslifeschoolofdivinity.org
- Include your order number
- Response within 1-2 business days`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "payment-2",
    title: "What is your refund policy?",
    category: "payment",
    excerpt: "Information about refunds and the 14-day refund window.",
    content: `We offer a straightforward 14-day refund policy to ensure your satisfaction.

**Refund Eligibility**:
- Request within 14 days of enrollment
- Technical issues preventing course access
- Course cancelled by Cross Life School of Divinity
- Unable to verify identity during enrollment
- Payment plan cancellation within 14 days

**Non-Refundable Items**:
- CLAC certificates (once issued)
- Background check fees ($50 for Chaplaincy)
- Refund requests after 14 days
- Courses more than 50% complete

**Requesting a Refund**:
1. Email support@crosslifeschoolofdivinity.org
2. Include your enrollment ID
3. Explain your reason for refund
4. We'll respond within 1-2 business days
5. Refund processed within 2-3 weeks

**Refund Timeline**:
- Approval: 1-2 business days
- Processing: 2-3 weeks
- Bank deposit: Depends on your financial institution
- Course access revoked after approval

**Payment Plan Refunds**:
- Full refund of payments made
- Remaining payments waived
- Same 14-day window applies

For detailed information, visit our Refund Policy page.`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "tech-1",
    title: "I'm having trouble logging in. What should I do?",
    category: "technical",
    excerpt: "Troubleshooting steps for login issues.",
    content: `If you're having trouble logging in, try these troubleshooting steps:

**Common Issues & Solutions**:

**Forgot Password**:
1. Click "Forgot Password" on login page
2. Enter your email address
3. Check your email for reset link
4. Click link and create new password
5. Log in with new password

**Email Not Received**:
- Check spam/junk folder
- Verify email address is correct
- Wait 5 minutes and try again
- Try resetting password again

**Account Not Found**:
- Verify you're using correct email
- Check if you used different email to register
- Try signing up as new user
- Contact support if you need help

**Browser Issues**:
- Clear browser cache and cookies
- Try a different browser
- Disable browser extensions
- Enable JavaScript and cookies

**Still Can't Log In?**:
1. Contact support@crosslifeschoolofdivinity.org
2. Include your email address
3. Describe what happens when you try to log in
4. Include any error messages
5. We'll respond within 1-2 business days

**Account Security**:
- Never share your password
- Use a strong, unique password
- Log out on shared computers
- Enable two-factor authentication if available`,
    helpful: 0,
    unhelpful: 0,
  },
  {
    id: "tech-2",
    title: "Videos are buffering or won't play. How do I fix this?",
    category: "technical",
    excerpt: "Troubleshooting video playback issues.",
    content: `Video playback issues are usually related to internet connection or browser settings. Try these solutions:

**Check Your Internet**:
- Test your connection speed (speedtest.net)
- Minimum recommended: 5 Mbps for streaming
- Move closer to your router
- Restart your router
- Avoid downloading large files while watching

**Browser Troubleshooting**:
- Clear browser cache and cookies
- Disable browser extensions
- Try a different browser
- Update your browser to latest version
- Enable JavaScript and cookies

**Video Player Settings**:
- Lower video quality (if available)
- Close other browser tabs
- Disable hardware acceleration
- Try fullscreen mode
- Refresh the page

**Device Issues**:
- Restart your computer
- Close other applications
- Check available disk space
- Update graphics drivers
- Restart your internet router

**Still Having Issues?**:
1. Email support@crosslifeschoolofdivinity.org
2. Include your course name
3. Describe what happens
4. Include your device and browser info
5. Attach a screenshot if possible

**Alternative Options**:
- Download transcript if available
- Read course materials instead
- Contact instructor for assistance
- We may provide alternative formats`,
    helpful: 0,
    unhelpful: 0,
  },
];

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [articleRatings, setArticleRatings] = useState<Record<string, "helpful" | "unhelpful" | null>>({});

  const categories = [
    { id: "enrollment", label: "Enrollment", icon: "📝" },
    { id: "verification", label: "ID Verification", icon: "✓" },
    { id: "access", label: "Course Access", icon: "🔑" },
    { id: "certificates", label: "Certificates", icon: "🎓" },
    { id: "payment", label: "Payment", icon: "💳" },
    { id: "technical", label: "Technical", icon: "⚙️" },
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleRating = (articleId: string, rating: "helpful" | "unhelpful") => {
    setArticleRatings(prev => ({
      ...prev,
      [articleId]: prev[articleId] === rating ? null : rating
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="accreditation" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 flex items-center gap-3">
              <BookOpen className="h-12 w-12" />
              Knowledge Base
            </h1>
            <p className="text-xl text-white/90">
              Find answers to common questions about enrollment, verification, courses, certificates, payments, and technical issues.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
              >
                All Categories
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                >
                  {category.icon} {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map(article => (
                <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader 
                    onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                    className="pb-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                            {categories.find(c => c.id === article.category)?.label}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">{article.excerpt}</p>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedArticle === article.id && (
                    <CardContent className="space-y-4 border-t pt-4">
                      <div className="prose prose-sm max-w-none">
                        {article.content.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="text-sm text-foreground whitespace-pre-wrap mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Helpfulness Rating */}
                      <div className="border-t pt-4 flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Was this helpful?</span>
                        <Button
                          variant={articleRatings[article.id] === "helpful" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleRating(article.id, "helpful")}
                          className="gap-2"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Yes
                        </Button>
                        <Button
                          variant={articleRatings[article.id] === "unhelpful" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleRating(article.id, "unhelpful")}
                          className="gap-2"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          No
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="border-2 border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <HelpCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Didn't find your answer?</h3>
                  <p className="text-muted-foreground mb-4">
                    Our support team is here to help. Contact us through our contact form or email support@crosslifeschoolofdivinity.org.
                  </p>
                  <Button asChild>
                    <a href="/contact">Contact Support</a>
                  </Button>
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
