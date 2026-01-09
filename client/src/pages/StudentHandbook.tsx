import { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Mail, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HandbookSection {
  id: string;
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

const sections: HandbookSection[] = [
  {
    id: 'welcome',
    title: 'Welcome to Cross Life School of Divinity',
    content: 'Welcome to Cross Life School of Divinity (CLSD), where we equip ministry leaders with rigorous theological education and practical ministry skills. This handbook is your comprehensive guide to navigating our platform, understanding our policies, and maximizing your learning experience.',
    subsections: [
      {
        title: 'Our Mission',
        content: 'To provide high-quality, CLAC-accredited theological education that empowers ministry leaders worldwide to deepen their biblical knowledge, strengthen their ministry skills, and transform their communities through the gospel of Jesus Christ.'
      },
      {
        title: 'Our Vision',
        content: 'A global community of equipped, spiritually mature ministry leaders who are making a transformative impact in their churches, communities, and nations.'
      }
    ]
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: 'Welcome to CLSD! Here\'s everything you need to know to begin your theological education journey.',
    subsections: [
      {
        title: 'Creating Your Account',
        content: 'Visit our website and click "Sign Up" to create your account. You\'ll need to provide: Full name, Email address, Password (minimum 8 characters, must include uppercase, lowercase, number, and special character), and agree to our Terms of Service.'
      },
      {
        title: 'Your First Login',
        content: 'After creating your account, log in with your email and password. You\'ll be directed to your Student Dashboard where you can view your enrolled courses, track progress, and access learning materials.'
      },
      {
        title: 'Enrollment Options',
        content: 'You can enroll in courses through several options: Individual Courses ($89 each), 3-Course Bundles ($299), Learning Paths ($199 for structured sequences), or All-Access Subscription ($49/month). Plus, get Bridge Academy GED prep FREE with any enrollment! Payment plans are available with 0% interest over 6 months.'
      },
      {
        title: 'Payment Methods',
        content: 'We accept credit cards, debit cards, and ACH bank transfers. All payments are processed securely through Stripe. You can manage your payment methods in your account settings.'
      }
    ]
  },
  {
    id: 'dashboard',
    title: 'Dashboard Navigation',
    content: 'Your Student Dashboard is your command center for all learning activities.',
    subsections: [
      {
        title: 'Dashboard Overview',
        content: 'The dashboard displays: Your enrolled courses with progress bars, Quick links to recent lessons, Your overall completion percentage, Upcoming assignments and due dates, and Access to your certificates and progress analytics.'
      },
      {
        title: 'My Courses',
        content: 'View all courses you\'re enrolled in. Each course card shows: Course title and description, Number of lessons completed, Overall progress percentage, and a button to continue learning or start the course.'
      },
      {
        title: 'My Progress',
        content: 'Track your learning analytics including: Completion rates by course, Quiz scores and averages, Assignment submission status, Study time tracking, and CPD/CLAC hours earned.'
      },
      {
        title: 'My Certificates',
        content: 'Access all certificates you\'ve earned. You can: View certificate details, Download individual certificates as PDF, Download all certificates as a bundle, Share certificates with others via unique verification links, and verify certificates using QR codes.'
      }
    ]
  },
  {
    id: 'course-structure',
    title: 'Course Structure and Format',
    content: 'Each CLSD course is designed for self-paced, online learning with a consistent structure.',
    subsections: [
      {
        title: 'Course Components',
        content: 'Every course includes: 10 comprehensive lessons covering biblical, theological, and practical topics, Video introductions and course materials, 5 quiz questions per lesson for self-assessment, Written assignments (typically 500-1000 words), Discussion forums for peer interaction, and Estimated completion time of 4-8 weeks at recommended pace.'
      },
      {
        title: 'Lessons',
        content: 'Each lesson contains: Opening statement and learning objectives, Comprehensive content with biblical exposition, Greek/Hebrew word studies, Theological analysis and scholar citations, 10-15 Scripture references, Discussion questions, and Reading assignments. Lessons are designed to take 1-2 hours to complete.'
      },
      {
        title: 'Quizzes',
        content: 'Quizzes help reinforce learning and track comprehension. Features include: 5 questions per lesson (mix of multiple choice, true/false, and short answer), Immediate feedback on answers, Score tracking and history, 70% minimum score required for course completion, and ability to retake quizzes to improve scores.'
      },
      {
        title: 'Assignments',
        content: 'Written assignments develop critical thinking and application skills. Each course includes: 3-5 written assignments per course, Typical length of 500-1000 words, Specific prompts and grading rubrics provided, Submission deadline (typically 2 weeks from lesson completion), Instructor feedback and grades within 5-7 business days, and ability to resubmit for improvement.'
      }
    ]
  },
  {
    id: 'academic-policies',
    title: 'Academic Policies',
    content: 'Understanding our academic standards ensures a fair and rigorous learning environment for all students.',
    subsections: [
      {
        title: 'Grading Standards',
        content: 'Grades are calculated as follows: Quizzes (50% of course grade) - 70% minimum required, Assignments (40% of course grade) - evaluated on theology, content quality, and writing, Participation (10% of course grade) - forum participation and engagement. Final course grade: 70% or higher required to earn certificate.'
      },
      {
        title: 'Course Completion',
        content: 'To complete a course and earn your certificate: Complete all 10 lessons, Submit all required quizzes (70% minimum score), Submit all assignments on time, Achieve 70% or higher final course grade, and Meet any course-specific requirements (e.g., chaplaincy background check).'
      },
      {
        title: 'Academic Integrity',
        content: 'We maintain high standards of academic integrity. Students must: Submit original work (no plagiarism), Properly cite all sources using standard citation format, Not share answers or assignments with other students, Not use AI to generate assignment content, and Report any suspected academic integrity violations. Violations may result in course failure or account suspension.'
      },
      {
        title: 'Attendance and Participation',
        content: 'CLSD is self-paced, so there are no synchronous class meetings. However, we encourage: Regular course engagement (logging in at least 2-3 times per week), Active participation in discussion forums, Timely submission of assignments, and communication with instructors about challenges or delays.'
      },
      {
        title: 'Late Work Policy',
        content: 'Assignments submitted after the due date: 1-3 days late: 5% grade reduction, 4-7 days late: 10% grade reduction, More than 7 days late: Not accepted without instructor approval. Contact your instructor if you need an extension before the due date.'
      }
    ]
  },
  {
    id: 'payment-info',
    title: 'Payment and Refund Information',
    content: 'Clear pricing and flexible payment options make theological education accessible.',
    subsections: [
      {
        title: 'Pricing Options',
        content: 'Individual Courses: $89 per course (lifetime access), 3-Course Bundles: $299 (save $88), Learning Paths: $199 per path (4-6 courses), All-Access Subscription: $49/month (unlimited access to all courses), Chaplain Training: $325 (specialized program), Bridge Academy GED Prep: FREE with any enrollment, and Payment Plans: 0% interest, 6-month installments available for all options.'
      },
      {
        title: 'Payment Methods',
        content: 'We accept: Credit cards (Visa, Mastercard, American Express), Debit cards, and ACH bank transfers. All payments are processed securely through Stripe. You can save multiple payment methods for future purchases.'
      },
      {
        title: 'Refund Policy',
        content: '14-day money-back guarantee on all purchases. To request a refund: Contact support@crosslifeschoolofdivinity.org within 14 days of purchase, Provide your order number and reason for refund, Refunds are processed within 2-3 weeks. Note: Refunds are not available for completed courses or after 14 days.'
      },
      {
        title: 'Payment Plans',
        content: 'All courses and bundles are available with 0% interest payment plans: 6-month installment option, First payment due at enrollment, Remaining payments automatically charged monthly, No interest or hidden fees, and ability to pay off early without penalty. If a payment fails, you have 3 days to update your payment method before course access is suspended.'
      },
      {
        title: 'Financial Aid',
        content: 'We offer internal financial aid through CLAC including: Ministry Scholarships (up to 20% discount), Need-Based Aid (up to 25% discount), Church Partnership Discounts (15% off), and Referral Credits ($50 per successful referral). Visit our Financial Aid page to apply.'
      }
    ]
  },
  {
    id: 'student-support',
    title: 'Student Support and Resources',
    content: 'We\'re committed to your success and provide comprehensive support throughout your learning journey.',
    subsections: [
      {
        title: 'Technical Support',
        content: 'For technical issues: Email: support@crosslifeschoolofdivinity.org, Phone: (312) 300-3295, Hours: Monday-Friday, 9am-5pm CST, Response time: 1-2 business days. Common issues: Video playback problems, Login issues, File upload errors, and Course access problems.'
      },
      {
        title: 'Academic Support',
        content: 'For questions about course content: Post in course discussion forums, Email your instructor through the course page, Schedule a virtual office hours session (by appointment), and access the Knowledge Base for common questions. Our instructors typically respond within 24-48 hours.'
      },
      {
        title: 'Knowledge Base',
        content: 'Our comprehensive Knowledge Base includes articles on: Enrollment and registration, Course access and navigation, Quiz and assignment submission, Certificate earning and verification, Payment and refund processes, and Technical troubleshooting. Search by keyword or browse by category.'
      },
      {
        title: 'Discussion Forums',
        content: 'Each course has dedicated discussion forums where you can: Ask questions about lesson content, Share insights and perspectives, Collaborate with other students, Receive feedback from instructors, and build community. Forum participation counts toward your course grade.'
      },
      {
        title: 'Instructor Office Hours',
        content: 'Instructors hold virtual office hours for one-on-one support. To schedule: Email your instructor to request a time, Sessions are typically 30 minutes, Conducted via video call (Zoom or Google Meet), and available by appointment during business hours.'
      }
    ]
  },
  {
    id: 'academic-integrity',
    title: 'Academic Integrity and Conduct',
    content: 'Academic integrity is fundamental to our educational mission and the value of your degree.',
    subsections: [
      {
        title: 'What is Academic Integrity?',
        content: 'Academic integrity means: Submitting original work that you created, Properly citing all sources and references, Not plagiarizing or copying others\' work, Not cheating on quizzes or exams, Not sharing answers with other students, and being honest in all academic endeavors.'
      },
      {
        title: 'Plagiarism',
        content: 'Plagiarism is presenting someone else\'s work as your own. This includes: Copying text without quotation marks and citations, Paraphrasing without attribution, Using ideas without crediting the source, Submitting work written by someone else, and using AI to generate assignment content. All assignments are checked for plagiarism using detection software.'
      },
      {
        title: 'Proper Citation',
        content: 'Always cite your sources using: Chicago Manual of Style (preferred for theology), MLA format, or APA format. Include: Author name, Publication title, Publication date, Publisher information, and page numbers. When in doubt, cite the source. Your instructor can help with citation questions.'
      },
      {
        title: 'Consequences of Violations',
        content: 'Academic integrity violations may result in: Assignment failure (0 grade), Course failure, Account suspension, Loss of certificates, and referral to appropriate authorities. We take academic integrity seriously to protect the value of your education and the reputation of CLSD.'
      }
    ]
  },
  {
    id: 'faqs',
    title: 'Frequently Asked Questions',
    content: 'Answers to common questions about CLSD.',
    subsections: [
      {
        title: 'How long do I have access to courses?',
        content: 'Individual courses provide lifetime access once purchased. All-Access Subscription provides access as long as your subscription is active. Learning Paths and Bundles provide lifetime access to course materials.'
      },
      {
        title: 'Can I download course materials?',
        content: 'Yes, you can download lesson content, reading materials, and assignments. Video content cannot be downloaded but can be streamed online. You can save PDFs and documents to your computer.'
      },
      {
        title: 'What if I need to take a break?',
        content: 'You can pause your learning at any time. Your progress is saved automatically. For subscriptions, you can pause your subscription for up to 3 months without losing access. Contact support for assistance.'
      },
      {
        title: 'How do I earn my certificate?',
        content: 'Complete all course requirements: 10 lessons, all quizzes (70%+ minimum), all assignments, and achieve 70%+ final grade. Your certificate is automatically generated and available in your "My Certificates" section.'
      },
      {
        title: 'Can I transfer credits to another school?',
        content: 'CLSD is not regionally accredited, but we are CLAC-accredited. Many schools accept CLAC credits. Check with your target institution about their transfer credit policy. We provide transcripts and verification documents upon request.'
      },
      {
        title: 'What if I have a disability?',
        content: 'We\'re committed to accessibility. If you need accommodations: Email support@crosslifeschoolofdivinity.org with documentation, We\'ll work with you to provide reasonable accommodations, and options may include extended time, alternative formats, or other supports.'
      }
    ]
  },
  {
    id: 'contact',
    title: 'Contact Information and Support',
    content: 'We\'re here to help! Reach out with any questions or concerns.',
    subsections: [
      {
        title: 'General Support',
        content: 'Email: support@crosslifeschoolofdivinity.org\nPhone: (312) 300-3295\nHours: Monday-Friday, 9am-5pm CST\nResponse Time: 1-2 business days'
      },
      {
        title: 'Enrollment Questions',
        content: 'Email: enrollment@crosslifeschoolofdivinity.org\nPhone: (312) 300-3295\nWe can help with: Course selection, Payment options, Financial aid, and enrollment process'
      },
      {
        title: 'Academic Concerns',
        content: 'Email your course instructor directly through the course page\nOr contact: academics@crosslifeschoolofdivinity.org\nWe address: Course content questions, Grade appeals, and academic integrity concerns'
      },
      {
        title: 'Technical Support',
        content: 'Email: support@crosslifeschoolofdivinity.org\nPhone: (312) 300-3295\nFor: Login issues, Video playback problems, File upload errors, and platform bugs'
      }
    ]
  }
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

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Student Handbook</h1>
          <p className="text-blue-100 text-lg">Your comprehensive guide to Cross Life School of Divinity</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Download Button */}
        <div className="mb-8 flex gap-4">
          <Button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Download as PDF
          </Button>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className="text-left text-blue-600 hover:text-blue-800 hover:underline"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Handbook Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="w-6 h-6 text-blue-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {/* Section Content */}
              {expandedSections.has(section.id) && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-700 mb-6 leading-relaxed">{section.content}</p>

                  {/* Subsections */}
                  {section.subsections && (
                    <div className="space-y-6">
                      {section.subsections.map((subsection, idx) => (
                        <div key={idx} className="bg-white p-4 rounded border-l-4 border-blue-600">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {subsection.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
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
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                <p className="text-gray-700">support@crosslifeschoolofdivinity.org</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                <p className="text-gray-700">(312) 300-3295</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Hours</h3>
                <p className="text-gray-700">Monday-Friday, 9am-5pm CST</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Response Time</h3>
                <p className="text-gray-700">1-2 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>Last Updated: December 2024</p>
          <p>Cross Life School of Divinity | CLAC Accredited</p>
        </div>
      </div>
    </div>
  );
}
