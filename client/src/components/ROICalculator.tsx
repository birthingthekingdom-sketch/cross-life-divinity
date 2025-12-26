import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrendingDown, Clock, DollarSign } from "lucide-react";

interface CalculationResult {
  plan: string;
  totalCost: number;
  costPerCourse: number;
  totalDuration: string;
  coursesCompleted: number;
  savingsVsIndividual: number;
}

export function ROICalculator() {
  const [numCourses, setNumCourses] = useState(5);
  const [learningPace, setLearningPace] = useState("moderate"); // slow, moderate, fast

  // Plan data
  const plans = {
    individual: { pricePerCourse: 89, weeksPerCourse: 6 },
    bundle: { price: 299, courses: 3, weeksPerCourse: 6 },
    path: { price: 199, courses: 4, weeksPerCourse: 5.5 },
    allAccess: { pricePerMonth: 49, courses: 18, weeksPerCourse: 5 },
  };

  // Pace multipliers (affects weeks per course)
  const paceMultipliers = {
    slow: 1.5,
    moderate: 1,
    fast: 0.7,
  };

  const multiplier = paceMultipliers[learningPace as keyof typeof paceMultipliers];

  // Calculate results for each plan
  const results = useMemo(() => {
    const calculations: CalculationResult[] = [];

    // Individual courses
    if (numCourses >= 1) {
      const totalCost = numCourses * plans.individual.pricePerCourse;
      const totalWeeks = numCourses * plans.individual.weeksPerCourse * multiplier;
      const months = Math.ceil(totalWeeks / 4.33);

      calculations.push({
        plan: "Individual Courses",
        totalCost,
        costPerCourse: plans.individual.pricePerCourse,
        totalDuration: `${months} months`,
        coursesCompleted: numCourses,
        savingsVsIndividual: 0,
      });
    }

    // Bundles (3-course packs)
    if (numCourses >= 3) {
      const numBundles = Math.ceil(numCourses / 3);
      const totalCost = numBundles * plans.bundle.price;
      const costPerCourse = Math.round(totalCost / numCourses);
      const totalWeeks = numCourses * plans.bundle.weeksPerCourse * multiplier;
      const months = Math.ceil(totalWeeks / 4.33);
      const savings = numCourses * plans.individual.pricePerCourse - totalCost;

      calculations.push({
        plan: "3-Course Bundles",
        totalCost,
        costPerCourse,
        totalDuration: `${months} months`,
        coursesCompleted: numCourses,
        savingsVsIndividual: savings,
      });
    }

    // Learning Paths (4-course packs)
    if (numCourses >= 4) {
      const numPaths = Math.ceil(numCourses / 4);
      const totalCost = numPaths * plans.path.price;
      const costPerCourse = Math.round(totalCost / numCourses);
      const totalWeeks = numCourses * plans.path.weeksPerCourse * multiplier;
      const months = Math.ceil(totalWeeks / 4.33);
      const savings = numCourses * plans.individual.pricePerCourse - totalCost;

      calculations.push({
        plan: "Learning Paths",
        totalCost,
        costPerCourse,
        totalDuration: `${months} months`,
        coursesCompleted: numCourses,
        savingsVsIndividual: savings,
      });
    }

    // All-Access Subscription
    if (numCourses >= 5) {
      const totalWeeks = numCourses * plans.allAccess.weeksPerCourse * multiplier;
      const months = Math.ceil(totalWeeks / 4.33);
      const totalCost = months * plans.allAccess.pricePerMonth;
      const costPerCourse = Math.round(totalCost / numCourses);
      const savings = numCourses * plans.individual.pricePerCourse - totalCost;

      calculations.push({
        plan: "All-Access Subscription",
        totalCost,
        costPerCourse,
        totalDuration: `${months} months`,
        coursesCompleted: numCourses,
        savingsVsIndividual: savings,
      });
    }

    return calculations;
  }, [numCourses, learningPace, multiplier]);

  // Find best value
  const bestValue = results.length > 0 ? results.reduce((min, curr) => 
    curr.costPerCourse < min.costPerCourse ? curr : min
  ) : null;

  return (
    <div className="w-full space-y-6">
      {/* Calculator Controls */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            ROI Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            See how much you'll save by choosing the right plan for your learning goals
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Number of Courses Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-foreground">
                How many courses do you plan to take?
              </label>
              <span className="text-2xl font-bold text-primary">{numCourses}</span>
            </div>
            <Slider
              value={[numCourses]}
              onValueChange={(value) => setNumCourses(value[0])}
              min={1}
              max={18}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Drag to select 1-18 courses
            </p>
          </div>

          {/* Learning Pace Selection */}
          <div className="space-y-3">
            <label className="font-semibold text-foreground">
              What's your preferred learning pace?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "slow", label: "Slow", desc: "50% more time" },
                { value: "moderate", label: "Moderate", desc: "Standard pace" },
                { value: "fast", label: "Fast", desc: "30% faster" },
              ].map((pace) => (
                <button
                  key={pace.value}
                  onClick={() => setLearningPace(pace.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    learningPace === pace.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold text-sm">{pace.label}</div>
                  <div className="text-xs text-muted-foreground">{pace.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your ROI Comparison</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {results.map((result) => (
              <Card
                key={result.plan}
                className={`relative overflow-hidden transition-all ${
                  bestValue?.plan === result.plan
                    ? "border-primary border-2 shadow-lg"
                    : ""
                }`}
              >
                {bestValue?.plan === result.plan && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    BEST VALUE
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{result.plan}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cost Per Course */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Cost per course
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ${result.costPerCourse}
                    </div>
                  </div>

                  {/* Total Cost */}
                  <div className="space-y-1 border-t pt-3">
                    <div className="text-sm text-muted-foreground">Total investment</div>
                    <div className="text-xl font-semibold">${result.totalCost.toLocaleString()}</div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1 border-t pt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Time to complete
                    </div>
                    <div className="text-lg font-semibold">{result.totalDuration}</div>
                  </div>

                  {/* Savings */}
                  {result.savingsVsIndividual > 0 && (
                    <div className="space-y-1 border-t pt-3 bg-green-50 -mx-6 -mb-6 px-6 py-3 rounded-b-lg">
                      <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
                        <TrendingDown className="h-4 w-4" />
                        You save
                      </div>
                      <div className="text-lg font-bold text-green-700">
                        ${result.savingsVsIndividual.toLocaleString()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          {bestValue && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Best Value for Your Goals
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Based on taking <strong>{numCourses} courses</strong> at a <strong>{learningPace}</strong> pace,{" "}
                      <strong>{bestValue.plan}</strong> offers the best cost-per-course at{" "}
                      <strong>${bestValue.costPerCourse}</strong>. You'll complete all courses in approximately{" "}
                      <strong>{bestValue.totalDuration}</strong> for a total investment of{" "}
                      <strong>${bestValue.totalCost.toLocaleString()}</strong>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center">
            * Calculations based on average course completion times. Actual duration may vary based on your schedule and learning style.
          </p>
        </div>
      )}
    </div>
  );
}
