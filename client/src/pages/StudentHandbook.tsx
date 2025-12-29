import { useState } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Section {
  id: string;
  title: string;
  content: string;
  subsections?: { title: string; content: string }[];
}

const sections: Section[] = [
  {
    id: 'welcome',
    title: 'Welcome to Cross Life School of Divinity',
    content: `Welcome to the Cross Life School of Divinity (CLSD) community! We are delighted to have you join our mission to provide high-quality, CLAC-accredited theological education that empowers ministry leaders worldwide. This handbook serves as your comprehensive guide to navigating your educational journey with us, understanding our policies, accessing resources, and making the most of your learning experience.

Whether you are pursuing individual courses to deepen your biblical knowledge, enrolling in a structured learning path, or pursuing our specialized Chaplain's Training program, this handbook will help you understand how our platform works, what to expect, and how to succeed in your studies.`,
  },
  {
    id: 'getting-started',
    title: 'Getting Started: Your First Steps',
    content: '',
    subsections: [
      {
        title: 'Creating Your Account',
        content: `Your journey at Cross Life School of Divinity begins with account creation. Visit our website and select "Sign Up" to create your student account. You will need to provide your full name, email address, and create a secure password. We recommend using a strong password that includes uppercase letters, lowercase letters, numbers, and special characters to protect your account.

After registration, you will receive a welcome email confirming your account creation. Check your email (including spam folders) for this important message, which contains your login credentials and a link to access our learning platform.`,
      },
      {
        title: 'Logging In to Your Account',
        content: `Once your account is created, you can log in at any time using your email address and password. Simply visit the login page, enter your credentials, and click "Log In." You will be directed to your personal student dashboard, which displays your enrolled courses, progress tracking, upcoming assignments, and important notifications.

If you forget your password, click "Forgot Password?" on the login page. Enter your email address, and we will send you a secure password reset link. Follow the instructions in the email to create a new password. For security reasons, password reset links expire after 24 hours, so act quickly if you need to reset your password.`,
      },
      {
        title: 'Enrollment Options',
        content: `Cross Life School of Divinity offers flexible enrollment options to meet your needs and budget. You can choose from individual course purchases, structured learning paths, course bundles, or our all-access subscription. Each option is designed to provide excellent value and support your theological education goals.

Individual Courses: Purchase individual courses at $89 per course with lifetime access. This option is perfect if you want to study specific topics without committing to a full program.

Learning Paths: Our three structured learning paths ($199 each) guide you through a carefully sequenced curriculum designed for specific educational goals.

Course Bundles: Select any three courses and save $88 with our course bundle option ($299 total).

All-Access Subscription: Our most popular option, the all-access subscription ($49/month) provides unlimited access to all 18 courses and 180+ lessons.

Payment Plans: All programs are available with 0% interest payment plans spread over six months.`,
      },
    ],
  },
  {
    id: 'dashboard',
    title: 'Navigating Your Student Dashboard',
    content: '',
    subsections: [
      {
        title: 'Dashboard Overview',
        content: `Your student dashboard is your personal command center at Cross Life School of Divinity. Upon logging in, you will see your personalized dashboard displaying your enrolled courses, progress tracking, upcoming assignments, and important announcements.

The dashboard is organized into several key sections. Your course cards show all enrolled courses with visual progress indicators. Each course card displays the course title, number of lessons, your current progress percentage, and quick action buttons to continue learning or view course details.

Your progress summary provides an overview of your overall achievement, including total courses enrolled, courses completed, average quiz scores, and CLAC hours earned.`,
      },
      {
        title: 'Accessing Your Courses',
        content: `To access a course, click on the course card from your dashboard or navigate to the "My Courses" section. Each course page displays the course description, learning objectives, total lessons, and a complete lesson list. Click on any lesson to begin studying.

Lessons are organized sequentially, and you can access them in any order. However, some courses may have prerequisite requirements that you must complete before accessing advanced lessons.`,
      },
      {
        title: 'Tracking Your Progress',
        content: `Your progress is automatically tracked as you complete lessons, take quizzes, and submit assignments. The dashboard displays your completion percentage for each course, helping you visualize your progress toward course completion.

You can view detailed progress analytics by clicking "My Progress" in your dashboard. This page shows your completion rates by course, quiz score trends, assignment grades, study time tracking, and CLAC hours earned.`,
      },
    ],
  },
  {
    id: 'courses',
    title: 'Understanding Course Structure',
    content: '',
    subsections: [
      {
        title: 'Lessons and Learning Materials',
        content: `Each course consists of 10 comprehensive lessons designed to build your knowledge progressively. Each lesson includes multiple components to support your learning.

Lesson content provides the core educational material, typically 3,000-4,500 words of seminary-quality theological instruction. Most lessons include an introductory video providing visual context and instructor commentary, ranging from 5-15 minutes.

Reading materials and Scripture references are provided for each lesson. We encourage you to engage with the primary sources and recommended theological resources to deepen your understanding.`,
      },
      {
        title: 'Quizzes and Assessments',
        content: `Each lesson includes a comprehensive quiz designed to assess your understanding of the material. Quizzes typically contain 10 questions in multiple formats: multiple-choice questions, true/false questions, and short-answer questions.

Quizzes are automatically graded for multiple-choice and true/false questions, providing immediate feedback. You must score at least 70% on quizzes to earn credit for course completion. You can retake quizzes as many times as needed to achieve the 70% passing grade.`,
      },
      {
        title: 'Assignments and Written Work',
        content: `Most courses include written assignments requiring you to apply course concepts to your ministry context. Assignments typically ask you to write 500-1,500 word papers on topics related to the lesson content.

Assignments are submitted through our online submission system. You can upload Word documents, PDFs, or other file formats. Assignments are graded by our instructors using a detailed rubric assessing theological understanding (40%), content quality and depth (40%), and writing mechanics and clarity (20%).`,
      },
    ],
  },
  {
    id: 'academic',
    title: 'Academic Policies and Standards',
    content: '',
    subsections: [
      {
        title: 'Grading System',
        content: `Your performance in each course is evaluated based on multiple components. Quiz scores typically comprise 50% of your course grade, reflecting your understanding of lesson content. Assignment grades comprise 40% of your course grade, reflecting your ability to apply concepts and communicate theological understanding. Participation and engagement comprise 10% of your course grade.

Your final course grade is calculated as a weighted average of these components. You must achieve a minimum grade of 70% to pass a course and earn credit.`,
      },
      {
        title: 'Certificate Eligibility',
        content: `Upon completing all lessons, quizzes, and assignments in a course with a minimum grade of 70%, you become eligible to earn a CLAC certificate for that course. Certificates are automatically generated and available for download from your dashboard.

CLAC certificates include your name, the course title, the date of completion, CLAC hours earned, a unique verification code, and a QR code for verification.`,
      },
      {
        title: 'Extensions and Incomplete Grades',
        content: `If you are unable to complete a course by the scheduled end date, you can request an extension. Extensions are typically granted for up to 30 additional days. To request an extension, contact our student support team with an explanation of your circumstances.`,
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment and Financial Information',
    content: '',
    subsections: [
      {
        title: 'Payment Methods',
        content: `Cross Life School of Divinity accepts multiple payment methods to provide flexibility and convenience. We accept credit cards (Visa, Mastercard, American Express), ACH bank transfers, and payment plans for all programs.

Payment processing is secure and encrypted using industry-standard security protocols. Your payment information is never stored on our servers and is processed through PCI-compliant payment processors.`,
      },
      {
        title: 'Payment Plans',
        content: `All programs are available with 0% interest payment plans spread over six months. Payment plans allow you to spread the cost of your education into manageable monthly payments without any additional interest or fees.

For example, a $399 learning path can be paid as six monthly payments of $66.50. Payment plans begin immediately upon enrollment, with the first payment due at enrollment.`,
      },
      {
        title: 'Refund Policy',
        content: `We offer a 14-day money-back guarantee on all purchases. If you are not satisfied with your purchase for any reason, contact our student support team within 14 days of purchase for a full refund.

Refunds are processed within 2-3 business days of approval.`,
      },
    ],
  },
  {
    id: 'support',
    title: 'Student Support and Resources',
    content: '',
    subsections: [
      {
        title: 'Technical Support',
        content: `If you experience technical difficulties accessing the platform, viewing course materials, or submitting assignments, our technical support team is here to help. Contact us through our support form, email support@crosslifeschoolofdivinity.org, or call (312) 300-3295 during business hours (Monday-Friday, 9am-5pm CST).

Common technical issues and solutions are available in our Knowledge Base.`,
      },
      {
        title: 'Academic Support',
        content: `If you are struggling with course content or need clarification on concepts, our academic support team can help. You can post questions in course discussion forums, where instructors and peers can provide guidance.`,
      },
      {
        title: 'Student Success Coaching',
        content: `We offer optional student success coaching to help you develop effective study habits, manage your time effectively, and achieve your educational goals. Our student success coaches can help you create a study schedule, identify your learning style, and maintain motivation throughout your studies.`,
      },
    ],
  },
  {
    id: 'conduct',
    title: 'Student Conduct and Academic Integrity',
    content: '',
    subsections: [
      {
        title: 'Code of Conduct',
        content: `As a member of the Cross Life School of Divinity community, you are expected to conduct yourself with integrity, respect, and professionalism. This includes treating other students and instructors with respect, following all platform rules and policies, using the platform only for authorized educational purposes.

Violations of our code of conduct may result in warnings, temporary suspension of account access, or permanent removal from the platform.`,
      },
      {
        title: 'Academic Integrity',
        content: `Academic integrity is fundamental to our mission and values. We expect all students to complete their own work, properly cite sources, and refrain from plagiarism, cheating, or other forms of academic dishonesty.

We use plagiarism detection software to identify potential academic integrity violations. If violations are detected, we will contact you to discuss the situation and determine appropriate next steps.`,
      },
    ],
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    content: `
**How long do I have to complete a course?**
You have unlimited time to complete courses. There are no time limits or deadlines for course completion.

**Can I access courses on mobile devices?**
Yes, our platform is fully responsive and works on smartphones, tablets, laptops, and desktop computers.

**What if I fall behind in my studies?**
If you fall behind, contact our student support team. We can help you create a catch-up plan and connect you with academic support resources.

**Can I download course materials for offline viewing?**
Yes, you can download lesson content, videos, and reading materials for offline viewing.

**How do I earn CLAC certificates?**
CLAC certificates are automatically generated when you complete all lessons, quizzes, and assignments in a course with a minimum grade of 70%.

**Can I transfer credits to other institutions?**
While CLSD is CLAC-accredited, individual institutions determine their own transfer credit policies.

**What if I need to cancel my subscription?**
You can cancel your subscription at any time through your account settings.

**How do I update my payment method?**
You can update your payment method through your account settings.

**Can I get a refund?**
We offer a 14-day money-back guarantee on all purchases.

**How do I contact student support?**
You can contact our student support team through our contact form at support@crosslifeschoolofdivinity.org, by phone at (312) 300-3295, or through our live chat feature.
    `,
  },
  {
    id: 'contact',
    title: 'Contact Information and Resources',
    content: `
**Student Support Team**

Email: support@crosslifeschoolofdivinity.org
Phone: (312) 300-3295
Hours: Monday-Friday, 9am-5pm CST
Response Time: Typically 1-2 business days

**Helpful Links**
- Knowledge Base: Comprehensive articles and tutorials
- Course Catalog: Browse all available courses
- Financial Aid: Information about payment plans and scholarships
- Accreditation: Learn about our CLAC accreditation
- Certificate Verification: Verify certificates

**Social Media**
Follow us on social media for updates and community connection:
- Facebook: @CrossLifeSchoolOfDivinity
- Instagram: @CLSOD_Theology
- Twitter: @CLSOD_Learning
    `,
  },
];

export default function StudentHandbook() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['welcome']));

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const downloadPDF = () => {
    const element = document.getElementById('handbook-content');
    if (!element) return;

    // Create a new window for printing
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>CLSD Student Handbook</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 20px;
            }
            h1 { color: #1e40af; font-size: 28px; margin-bottom: 10px; }
            h2 { color: #1e40af; font-size: 20px; margin-top: 20px; margin-bottom: 10px; }
            h3 { color: #1e40af; font-size: 16px; margin-top: 15px; margin-bottom: 8px; }
            p { margin-bottom: 10px; }
            .section { page-break-inside: avoid; margin-bottom: 20px; }
            .header { border-bottom: 3px solid #1e40af; padding-bottom: 10px; margin-bottom: 20px; }
            .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Cross Life School of Divinity</h1>
            <h2>Student Handbook</h2>
            <p>Your comprehensive guide to success at Cross Life School of Divinity</p>
          </div>
          ${getHandbookHTML()}
          <div class="footer">
            <p>© ${new Date().getFullYear()} Cross Life School of Divinity. All rights reserved.</p>
            <p>Last Updated: December 2025</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Trigger print dialog which can save as PDF
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const getHandbookHTML = () => {
    return `
      <div class="section">
        <h2>Welcome to Cross Life School of Divinity</h2>
        <p>Welcome to the Cross Life School of Divinity (CLSD) community! We are delighted to have you join our mission to provide high-quality, CLAC-accredited theological education that empowers ministry leaders worldwide.</p>
      </div>
      <div class="section">
        <h2>Getting Started: Your First Steps</h2>
        <h3>Creating Your Account</h3>
        <p>Your journey at Cross Life School of Divinity begins with account creation. Visit our website and select "Sign Up" to create your student account.</p>
        <h3>Logging In to Your Account</h3>
        <p>Once your account is created, you can log in at any time using your email address and password.</p>
        <h3>Enrollment Options</h3>
        <p>Cross Life School of Divinity offers flexible enrollment options to meet your needs and budget.</p>
      </div>
      <div class="section">
        <h2>Navigating Your Student Dashboard</h2>
        <p>Your student dashboard is your personal command center at Cross Life School of Divinity.</p>
      </div>
      <div class="section">
        <h2>Understanding Course Structure</h2>
        <p>Each course consists of 10 comprehensive lessons designed to build your knowledge progressively.</p>
      </div>
      <div class="section">
        <h2>Academic Policies and Standards</h2>
        <p>Your performance in each course is evaluated based on multiple components.</p>
      </div>
      <div class="section">
        <h2>Payment and Financial Information</h2>
        <p>Cross Life School of Divinity accepts multiple payment methods to provide flexibility and convenience.</p>
      </div>
      <div class="section">
        <h2>Student Support and Resources</h2>
        <p>If you experience technical difficulties or need support, our team is here to help.</p>
      </div>
      <div class="section">
        <h2>Student Conduct and Academic Integrity</h2>
        <p>Academic integrity is fundamental to our mission and values.</p>
      </div>
      <div class="section">
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to common questions about our programs and policies.</p>
      </div>
      <div class="section">
        <h2>Contact Information and Resources</h2>
        <p><strong>Email:</strong> support@crosslifeschoolofdivinity.org</p>
        <p><strong>Phone:</strong> (312) 300-3295</p>
        <p><strong>Hours:</strong> Monday-Friday, 9am-5pm CST</p>
      </div>
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Student Handbook</h1>
          <p className="text-blue-100 text-lg">
            Your comprehensive guide to success at Cross Life School of Divinity
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Download Button */}
        <div className="mb-8 flex justify-end">
          <Button
            onClick={downloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            title="Click to download the handbook as a PDF using your browser's print function"
          >
            <Download size={20} />
            Download as PDF
          </Button>
        </div>

        {/* Handbook Content */}
        <div id="handbook-content" className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <h2 className="text-xl font-semibold text-slate-900 text-left">
                  {section.title}
                </h2>
                <ChevronDown
                  size={24}
                  className={`text-slate-600 transition-transform flex-shrink-0 ${
                    expandedSections.has(section.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Section Content */}
              {expandedSections.has(section.id) && (
                <div className="px-6 py-4 border-t border-slate-200 space-y-6">
                  {section.content && (
                    <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                      {section.content}
                    </div>
                  )}

                  {section.subsections && section.subsections.length > 0 && (
                    <div className="space-y-6">
                      {section.subsections.map((subsection, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {subsection.title}
                          </h3>
                          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {subsection.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Conclusion */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mt-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Conclusion</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Welcome to the Cross Life School of Divinity community! We are excited to support
              your theological education and ministry development. This handbook provides
              essential information to help you succeed, but please do not hesitate to reach out
              to our student support team if you have questions or need assistance.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Your success is our priority. We are committed to providing excellent customer
              service, responsive support, and a learning environment where you can thrive. We
              look forward to supporting you on your educational journey and celebrating your
              achievements as you grow in knowledge, faith, and ministry effectiveness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
