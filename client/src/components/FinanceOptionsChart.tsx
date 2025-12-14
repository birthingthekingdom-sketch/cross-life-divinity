import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Calendar } from "lucide-react";
import { PAYMENT_PLANS, PRICING } from "@shared/const";

interface FinanceOption {
  type: 'LEARNING_PATH' | 'BUNDLE_3_COURSE' | 'CHAPLAINCY_TRAINING';
  name: string;
  fullPrice: number;
  monthlyPrice: number;
  months: number;
}

const financeOptions: FinanceOption[] = [
  {
    type: 'LEARNING_PATH',
    name: 'Learning Paths',
    fullPrice: PRICING.LEARNING_PATH,
    monthlyPrice: PAYMENT_PLANS.LEARNING_PATH.monthly,
    months: PAYMENT_PLANS.LEARNING_PATH.months,
  },
  {
    type: 'BUNDLE_3_COURSE',
    name: '3-Course Bundles',
    fullPrice: PRICING.BUNDLE_3_COURSE,
    monthlyPrice: PAYMENT_PLANS.BUNDLE_3_COURSE.monthly,
    months: PAYMENT_PLANS.BUNDLE_3_COURSE.months,
  },
  {
    type: 'CHAPLAINCY_TRAINING',
    name: 'Chaplaincy Training',
    fullPrice: PRICING.CHAPLAINCY_TRAINING,
    monthlyPrice: PAYMENT_PLANS.CHAPLAINCY_TRAINING.monthly,
    months: PAYMENT_PLANS.CHAPLAINCY_TRAINING.months,
  },
];

export function FinanceOptionsChart() {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Cross Life Tuition Assistance</CardTitle>
            <CardDescription className="mt-2">
              Interest-free payment plans available for all programs
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            0% Interest
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-4 font-semibold">Program</th>
                <th className="text-center p-4 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Full Payment</span>
                  </div>
                </th>
                <th className="text-center p-4 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Payment Plan</span>
                  </div>
                </th>
                <th className="text-center p-4 font-semibold">Benefits</th>
              </tr>
            </thead>
            <tbody>
              {financeOptions.map((option) => (
                <tr key={option.type} className="border-b border-border hover:bg-accent/5 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-foreground">{option.name}</div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      ${option.fullPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">One-time payment</div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      ${(option.monthlyPrice / 100).toFixed(2)}
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.months} monthly payments
                    </div>
                    <div className="text-xs font-semibold text-green-600 mt-1">
                      First month required
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Immediate access</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>No interest</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Pay off early</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <h4 className="font-semibold text-foreground mb-3">Payment Plan Terms</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>First month required:</strong> Initial payment due at enrollment</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Automatic billing:</strong> Monthly payments charged automatically</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Immediate access:</strong> Full course access upon first payment</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Missed payments:</strong> Access paused until current</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Early payoff:</strong> Pay remaining balance anytime, no penalty</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Refund policy:</strong> No refunds after 7 days from enrollment</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
