import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { useState } from "react";
import { 
  DollarSign, 
  Calculator, 
  GraduationCap, 
  Church, 
  Heart, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  FileText,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Financial Aid Calculator Component
function FinancialAidCalculator() {
  const [programType, setProgramType] = useState<string>("");
  const [ministryStatus, setMinistryStatus] = useState<string>("");
  const [churchSponsored, setChurchSponsored] = useState<string>("");
  const [financialNeed, setFinancialNeed] = useState<string>("");
  const [result, setResult] = useState<{
    originalCost: number;
    discount: number;
    finalCost: number;
    monthlyPayment: number;
    aidTypes: string[];
  } | null>(null);

  const calculateAid = () => {
    let originalCost = 0;
    let discount = 0;
    const aidTypes: string[] = [];

    // Base cost by program
    switch (programType) {
      case "subscription":
        originalCost = 399; // Learning Path
        break;
      case "bundle":
        originalCost = 299; // 3-Course Bundle
        break;
      case "chaplaincy":
        originalCost = 325; // Chaplaincy Training ($275 + $50 background check)
        break;
      case "single":
        originalCost = 89; // Single Course
        break;
      default:
        originalCost = 399;
    }

    // Ministry scholarship (10-20%)
    if (ministryStatus === "fulltime") {
      discount += originalCost * 0.20;
      aidTypes.push("Full-Time Ministry Scholarship (20%)");
    } else if (ministryStatus === "parttime") {
      discount += originalCost * 0.10;
      aidTypes.push("Part-Time Ministry Scholarship (10%)");
    }

    // Church partnership discount (15%)
    if (churchSponsored === "yes") {
      discount += originalCost * 0.15;
      aidTypes.push("Church Partnership Discount (15%)");
    }

    // Need-based aid (10-25%)
    if (financialNeed === "high") {
      discount += originalCost * 0.25;
      aidTypes.push("Need-Based Aid (25%)");
    } else if (financialNeed === "moderate") {
      discount += originalCost * 0.15;
      aidTypes.push("Need-Based Aid (15%)");
    } else if (financialNeed === "some") {
      discount += originalCost * 0.10;
      aidTypes.push("Need-Based Aid (10%)");
    }

    // Cap discount at 50%
    discount = Math.min(discount, originalCost * 0.50);
    
    const finalCost = originalCost - discount;
    const monthlyPayment = finalCost / 6;

    // Always include payment plan
    aidTypes.push("0% Interest Payment Plan (6 months)");

    setResult({
      originalCost,
      discount,
      finalCost,
      monthlyPayment,
      aidTypes
    });
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-white border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calculator className="h-6 w-6 text-primary" />
          Financial Aid Calculator
        </CardTitle>
        <p className="text-muted-foreground">
          Estimate your potential financial aid and monthly payment
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Program Type</Label>
            <Select value={programType} onValueChange={setProgramType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subscription">Learning Path ($399)</SelectItem>
                <SelectItem value="bundle">3-Course Bundle ($299)</SelectItem>
                <SelectItem value="chaplaincy">Chaplaincy Training ($325)</SelectItem>
                <SelectItem value="single">Single Course ($89)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ministry Status</Label>
            <Select value={ministryStatus} onValueChange={setMinistryStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fulltime">Full-Time Ministry Worker</SelectItem>
                <SelectItem value="parttime">Part-Time/Bi-Vocational Minister</SelectItem>
                <SelectItem value="volunteer">Volunteer Ministry Leader</SelectItem>
                <SelectItem value="none">Not Currently in Ministry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Church Sponsorship</Label>
            <Select value={churchSponsored} onValueChange={setChurchSponsored}>
              <SelectTrigger>
                <SelectValue placeholder="Is your church sponsoring you?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes, my church is sponsoring me</SelectItem>
                <SelectItem value="no">No church sponsorship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Financial Need Level</Label>
            <Select value={financialNeed} onValueChange={setFinancialNeed}>
              <SelectTrigger>
                <SelectValue placeholder="Select your need level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Need - Significant financial hardship</SelectItem>
                <SelectItem value="moderate">Moderate Need - Some financial constraints</SelectItem>
                <SelectItem value="some">Some Need - Minor financial assistance helpful</SelectItem>
                <SelectItem value="none">No Need - Can pay full tuition</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={calculateAid} 
          className="w-full"
          disabled={!programType}
        >
          Calculate My Aid
        </Button>

        {result && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4">Your Estimated Financial Aid</h3>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-muted-foreground">Original Cost</p>
                <p className="text-2xl font-bold line-through text-gray-400">${result.originalCost}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-muted-foreground">Your Discount</p>
                <p className="text-2xl font-bold text-green-600">-${result.discount.toFixed(0)}</p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <p className="text-sm text-muted-foreground">Your Cost</p>
                <p className="text-2xl font-bold text-primary">${result.finalCost.toFixed(0)}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg mb-4">
              <p className="text-center">
                <span className="text-muted-foreground">With 0% interest payment plan:</span>
                <span className="text-2xl font-bold text-primary ml-2">
                  ${result.monthlyPayment.toFixed(2)}/month
                </span>
                <span className="text-muted-foreground ml-1">× 6 months</span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-green-800">Aid Types You May Qualify For:</p>
              <ul className="space-y-1">
                {result.aidTypes.map((aid, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    {aid}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              * This is an estimate. Final aid amount determined upon application review.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Financial Aid Application Form
function FinancialAidApplication() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and contact you within 3-5 business days.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-6 w-6 text-primary" />
          Financial Aid Application
        </CardTitle>
        <p className="text-muted-foreground">
          Complete this form to apply for CLAC financial assistance
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" required placeholder="Enter your first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" required placeholder="Enter your last name" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" required placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" required placeholder="(555) 123-4567" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">Program of Interest *</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner Learning Path ($399)</SelectItem>
                <SelectItem value="intermediate">Intermediate Learning Path ($399)</SelectItem>
                <SelectItem value="advanced">Advanced Learning Path ($399)</SelectItem>
                <SelectItem value="bundle">3-Course Bundle ($299)</SelectItem>
                <SelectItem value="chaplaincy">Chaplaincy Training ($325)</SelectItem>
                <SelectItem value="single">Individual Course ($89)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ministry">Current Ministry Involvement *</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Describe your ministry status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pastor">Senior/Lead Pastor</SelectItem>
                <SelectItem value="associate">Associate/Assistant Pastor</SelectItem>
                <SelectItem value="youth">Youth/Children's Ministry Leader</SelectItem>
                <SelectItem value="worship">Worship Leader</SelectItem>
                <SelectItem value="bivocational">Bi-Vocational Minister</SelectItem>
                <SelectItem value="missionary">Missionary</SelectItem>
                <SelectItem value="volunteer">Volunteer Ministry Leader</SelectItem>
                <SelectItem value="preparing">Preparing for Ministry</SelectItem>
                <SelectItem value="other">Other Ministry Role</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="church">Church Name (if applicable)</Label>
            <Input id="church" placeholder="Name of your church or ministry organization" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Annual Household Income Range *</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under25">Under $25,000</SelectItem>
                <SelectItem value="25-40">$25,000 - $40,000</SelectItem>
                <SelectItem value="40-60">$40,000 - $60,000</SelectItem>
                <SelectItem value="60-80">$60,000 - $80,000</SelectItem>
                <SelectItem value="80-100">$80,000 - $100,000</SelectItem>
                <SelectItem value="over100">Over $100,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="statement">Financial Need Statement *</Label>
            <Textarea 
              id="statement" 
              required
              placeholder="Please describe your financial situation and why you are requesting assistance. Include any relevant circumstances such as family size, other financial obligations, or special circumstances."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Ministry Goals *</Label>
            <Textarea 
              id="goals" 
              required
              placeholder="How will this theological education help you in your ministry? What are your ministry goals?"
              rows={3}
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              By submitting this application, I certify that all information provided is accurate and complete. 
              I understand that providing false information may result in denial or revocation of financial aid.
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function FinancialAid() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="financial-aid" />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <DollarSign className="h-12 w-12" />
            <h1 className="text-5xl font-bold">Financial Aid</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Cross Life School of Divinity is committed to making theological education accessible. 
            Through the Cross Life Accreditation Council (CLAC), we offer multiple financial aid options 
            to help qualified students pursue their calling.
          </p>
        </div>
      </section>

      {/* Aid Types Overview */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Financial Aid Options</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            While federal financial aid (FAFSA) is not available, CLSD offers comprehensive internal 
            financial assistance through CLAC.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-t-4 border-t-blue-500">
              <CardContent className="pt-6">
                <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Payment Plans</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Spread your tuition over 6 months with 0% interest. No credit check required.
                </p>
                <p className="text-2xl font-bold text-blue-500">0% Interest</p>
              </CardContent>
            </Card>

            <Card className="text-center border-t-4 border-t-green-500">
              <CardContent className="pt-6">
                <GraduationCap className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Ministry Scholarships</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Partial tuition assistance for active ministry workers serving in churches or missions.
                </p>
                <p className="text-2xl font-bold text-green-500">Up to 20% Off</p>
              </CardContent>
            </Card>

            <Card className="text-center border-t-4 border-t-purple-500">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Need-Based Aid</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Financial assistance based on demonstrated financial need and circumstances.
                </p>
                <p className="text-2xl font-bold text-purple-500">Up to 25% Off</p>
              </CardContent>
            </Card>

            <Card className="text-center border-t-4 border-t-amber-500">
              <CardContent className="pt-6">
                <Church className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Church Partnerships</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Reduced rates for students sponsored by partner churches or ministries.
                </p>
                <p className="text-2xl font-bold text-amber-500">15% Discount</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-primary/10 rounded-lg p-6 text-center">
            <p className="text-lg">
              <strong>Aid can be combined!</strong> Eligible students may receive up to 
              <span className="text-primary font-bold text-2xl mx-2">50% off</span>
              tuition through multiple aid types.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <FinancialAidCalculator />
        </div>
      </section>

      {/* Eligibility Requirements */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Eligibility Requirements</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-500" />
                  Ministry Scholarships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Currently serving in active ministry (paid or volunteer)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Letter of recommendation from church leadership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Commitment to complete the program within 12 months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Full-time ministers: 20% scholarship</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Part-time/bi-vocational ministers: 10% scholarship</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-500" />
                  Need-Based Aid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Demonstrated financial need through application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Written statement explaining financial circumstances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Household income verification may be requested</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>High need: Up to 25% assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Moderate need: Up to 15% assistance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Church className="h-5 w-5 text-amber-500" />
                  Church Partnership Discounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Church must be a registered CLSD partner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Written sponsorship letter from church leadership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Church may pay directly or reimburse student</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>15% automatic discount for sponsored students</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Churches: <a href="mailto:partnerships@crosslifeschoolofdivinity.org" className="text-primary underline">Become a partner</a></span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Payment Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Available to all students regardless of income</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>6-month payment plan with 0% interest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>No credit check required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Automatic monthly payments via credit/debit card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Can be combined with other aid types</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl mx-auto px-4">
          <FinancialAidApplication />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions About Financial Aid?</h2>
            <p className="text-muted-foreground">
              Our financial aid team is here to help you find the best options for your situation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Email Us</h3>
                <a href="mailto:financialaid@crosslifeschoolofdivinity.org" className="text-primary hover:underline">
                  financialaid@crosslifeschoolofdivinity.org
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Response within 1-2 business days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Call Us</h3>
                <a href="tel:312-300-3295" className="text-primary hover:underline text-lg">
                  312-300-3295
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Monday - Friday, 9am - 5pm CST
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Don't Let Finances Hold You Back</h2>
          <p className="text-xl text-white/90 mb-8">
            Your calling to ministry is too important. Let us help you find a way to pursue 
            your theological education.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/pricing">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                View Programs & Pricing
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
