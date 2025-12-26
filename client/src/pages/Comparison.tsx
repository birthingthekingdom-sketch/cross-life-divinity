import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useLocation } from "wouter";
import { ROICalculator } from "@/components/ROICalculator";

interface ComparisonItem {
  id: string;
  name: string;
  type: "individual" | "bundle" | "path";
  price: number;
  priceLabel: string;
  courses: number;
  duration: string;
  lessons: number;
  features: {
    name: string;
    included: boolean;
  }[];
  cta: string;
  highlight?: boolean;
}

const comparisonData: ComparisonItem[] = [
  {
    id: "individual",
    name: "Individual Course",
    type: "individual",
    price: 89,
    priceLabel: "$89 per course",
    courses: 1,
    duration: "4-8 weeks",
    lessons: 10,
    features: [
      { name: "Lifetime Access", included: true },
      { name: "10 Lessons", included: true },
      { name: "Quizzes & Assignments", included: true },
      { name: "CLAC Certificate", included: true },
      { name: "Discussion Forum", included: true },
      { name: "Course Bundles Discount", included: false },
      { name: "Learning Path Structure", included: false },
      { name: "Cohort Groups", included: false },
    ],
    cta: "Enroll Now",
  },
  {
    id: "bundle",
    name: "3-Course Bundle",
    type: "bundle",
    price: 299,
    priceLabel: "$299 for 3 courses",
    courses: 3,
    duration: "12-24 weeks",
    lessons: 30,
    features: [
      { name: "Lifetime Access", included: true },
      { name: "30 Lessons", included: true },
      { name: "Quizzes & Assignments", included: true },
      { name: "CLAC Certificates", included: true },
      { name: "Discussion Forums", included: true },
      { name: "Save $88 vs Individual", included: true },
      { name: "Learning Path Structure", included: false },
      { name: "Cohort Groups", included: false },
    ],
    cta: "Select Bundle",
    highlight: true,
  },
  {
    id: "path",
    name: "Learning Path",
    type: "path",
    price: 199,
    priceLabel: "$199 per path",
    courses: 4,
    duration: "5-6 months",
    lessons: 40,
    features: [
      { name: "Lifetime Access", included: true },
      { name: "40+ Lessons", included: true },
      { name: "Quizzes & Assignments", included: true },
      { name: "CLAC Certificate", included: true },
      { name: "Discussion Forums", included: true },
      { name: "Structured Progression", included: true },
      { name: "Cohort Groups", included: true },
      { name: "Payment Plan Available", included: true },
    ],
    cta: "Start Path",
  },
  {
    id: "allaccess",
    name: "All-Access Subscription",
    type: "path",
    price: 49,
    priceLabel: "$49/month",
    courses: 18,
    duration: "Unlimited",
    lessons: 180,
    features: [
      { name: "All 18 Courses", included: true },
      { name: "180+ Lessons", included: true },
      { name: "Unlimited Quizzes & Assignments", included: true },
      { name: "All CLAC Certificates", included: true },
      { name: "All Discussion Forums", included: true },
      { name: "Switch Between Courses", included: true },
      { name: "Cohort Groups", included: true },
      { name: "Cancel Anytime", included: true },
    ],
    cta: "Subscribe Now",
  },
];

export default function Comparison() {
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useState<"all" | "individual" | "bundle" | "path">("all");

  const filteredData =
    selectedTab === "all"
      ? comparisonData
      : comparisonData.filter((item) => {
          if (selectedTab === "individual") return item.type === "individual";
          if (selectedTab === "bundle") return item.type === "bundle";
          if (selectedTab === "path") return item.type === "path";
          return true;
        });

  const allFeatures = Array.from(
    new Set(comparisonData.flatMap((item) => item.features.map((f) => f.name)))
  );

  const handleCTA = (id: string) => {
    if (id === "individual") {
      navigate("/courses");
    } else if (id === "bundle") {
      navigate("/bundle-select");
    } else if (id === "path") {
      navigate("/learning-paths");
    } else if (id === "allaccess") {
      navigate("/subscription");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Compare Your Options</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Find the perfect learning plan for your theological education. Whether you're just starting or diving deep, we have an option that fits your needs and budget.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedTab === "all" ? "default" : "outline"}
              onClick={() => setSelectedTab("all")}
              className="rounded-full"
            >
              All Options
            </Button>
            <Button
              variant={selectedTab === "individual" ? "default" : "outline"}
              onClick={() => setSelectedTab("individual")}
              className="rounded-full"
            >
              Individual Courses
            </Button>
            <Button
              variant={selectedTab === "bundle" ? "default" : "outline"}
              onClick={() => setSelectedTab("bundle")}
              className="rounded-full"
            >
              Bundles
            </Button>
            <Button
              variant={selectedTab === "path" ? "default" : "outline"}
              onClick={() => setSelectedTab("path")}
              className="rounded-full"
            >
              Learning Paths & Subscription
            </Button>
          </div>
        </div>
      </section>

      {/* Comparison Cards - Mobile View */}
      <section className="py-12 block lg:hidden">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="space-y-6">
            {filteredData.map((item) => (
              <Card
                key={item.id}
                className={`overflow-hidden ${
                  item.highlight ? "border-primary border-2 shadow-lg" : ""
                }`}
              >
                {item.highlight && (
                  <div className="bg-primary text-white px-4 py-2 text-center text-sm font-semibold">
                    BEST VALUE
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl">{item.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary mt-2">
                    {item.priceLabel}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Courses</div>
                      <div className="text-xl font-semibold">{item.courses}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Duration</div>
                      <div className="text-xl font-semibold">{item.duration}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Lessons</div>
                      <div className="text-xl font-semibold">{item.lessons}+</div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    {item.features.map((feature) => (
                      <div key={feature.name} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={feature.included ? "" : "text-muted-foreground"}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleCTA(item.id)}
                    className="w-full mt-4"
                    variant={item.highlight ? "default" : "outline"}
                  >
                    {item.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table - Desktop View */}
      <section className="py-12 hidden lg:block">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-4 px-4 font-semibold text-lg">Feature</th>
                  {filteredData.map((item) => (
                    <th
                      key={item.id}
                      className={`text-center py-4 px-4 font-semibold text-lg ${
                        item.highlight ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="mb-2">{item.name}</div>
                      <div className="text-2xl font-bold text-primary">{item.priceLabel}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Quick Stats */}
                <tr className="border-b bg-muted/30">
                  <td className="py-4 px-4 font-semibold">Number of Courses</td>
                  {filteredData.map((item) => (
                    <td
                      key={`courses-${item.id}`}
                      className={`text-center py-4 px-4 text-lg font-semibold ${
                        item.highlight ? "bg-primary/5" : ""
                      }`}
                    >
                      {item.courses}
                    </td>
                  ))}
                </tr>
                <tr className="border-b bg-muted/30">
                  <td className="py-4 px-4 font-semibold">Total Lessons</td>
                  {filteredData.map((item) => (
                    <td
                      key={`lessons-${item.id}`}
                      className={`text-center py-4 px-4 text-lg font-semibold ${
                        item.highlight ? "bg-primary/5" : ""
                      }`}
                    >
                      {item.lessons}+
                    </td>
                  ))}
                </tr>
                <tr className="border-b bg-muted/30">
                  <td className="py-4 px-4 font-semibold">Typical Duration</td>
                  {filteredData.map((item) => (
                    <td
                      key={`duration-${item.id}`}
                      className={`text-center py-4 px-4 text-lg font-semibold ${
                        item.highlight ? "bg-primary/5" : ""
                      }`}
                    >
                      {item.duration}
                    </td>
                  ))}
                </tr>

                {/* Features */}
                {allFeatures.map((feature) => (
                  <tr key={feature} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-medium">{feature}</td>
                    {filteredData.map((item) => {
                      const featureItem = item.features.find((f) => f.name === feature);
                      return (
                        <td
                          key={`${item.id}-${feature}`}
                          className={`text-center py-4 px-4 ${
                            item.highlight ? "bg-primary/5" : ""
                          }`}
                        >
                          {featureItem?.included ? (
                            <Check className="h-6 w-6 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-6 w-6 text-gray-300 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* CTA Row */}
                <tr>
                  <td className="py-6 px-4"></td>
                  {filteredData.map((item) => (
                    <td
                      key={`cta-${item.id}`}
                      className={`text-center py-6 px-4 ${item.highlight ? "bg-primary/5" : ""}`}
                    >
                      <Button
                        onClick={() => handleCTA(item.id)}
                        variant={item.highlight ? "default" : "outline"}
                        size="lg"
                        className="w-full"
                      >
                        {item.cta}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Calculate Your ROI</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover which plan offers the best value for your learning goals. Adjust the number of courses and your preferred pace to see personalized cost and timeline estimates.
          </p>
          <ROICalculator />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Comparison FAQ</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade from individual courses to a bundle or learning path anytime. We'll credit your previous purchase toward the new plan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's the difference between a Bundle and a Learning Path?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bundles let you choose any 3 courses you want. Learning Paths are carefully curated sequences (Beginner, Intermediate, Advanced) designed to build your knowledge progressively. Paths also include cohort groups for peer support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is the All-Access Subscription worth it?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you plan to take 5+ courses, the All-Access Subscription at $49/month is more cost-effective than individual purchases. You also get unlimited access to all 18 courses, discussion forums, and cohort groups. Cancel anytime with no penalties.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer payment plans?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Learning Paths and Bundles are available with 0% interest payment plans over 6 months. Individual courses are also available with installment options. Contact our support team for details.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I lock in current pricing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! When you enroll at current rates, your pricing is locked in forever. Even if we raise prices in the future, you'll keep your current rate as long as you maintain your subscription or course access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
