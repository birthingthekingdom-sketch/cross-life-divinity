import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TuitionAgreementProps {
  programName: string;
  totalAmount: number;
  monthlyAmount: number;
  months: number;
  onAcceptChange: (accepted: boolean) => void;
  accepted: boolean;
}

export function TuitionAgreement({
  programName,
  totalAmount,
  monthlyAmount,
  months,
  onAcceptChange,
  accepted,
}: TuitionAgreementProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 50;
    if (isNearBottom && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle>Cross Life Tuition Assistance Agreement</CardTitle>
        <CardDescription>
          Please review and accept the payment plan terms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] rounded-md border p-4" onScrollCapture={handleScroll}>
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Payment Plan Details</h3>
              <p className="text-muted-foreground">
                This agreement establishes a payment plan for enrollment in <strong>{programName}</strong> at Cross Life School of Divinity.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Total Program Cost: <strong>${totalAmount.toFixed(2)}</strong></li>
                <li>Monthly Payment Amount: <strong>${monthlyAmount.toFixed(2)}</strong></li>
                <li>Number of Payments: <strong>{months} months</strong></li>
                <li>First Payment: <strong>Due immediately upon enrollment</strong></li>
                <li>Subsequent Payments: <strong>Automatically charged monthly</strong></li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. Course Access</h3>
              <p className="text-muted-foreground">
                Upon receipt of your first payment, you will receive immediate and full access to all courses included in your selected program. 
                Access will remain active as long as payments are current.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Automatic Monthly Billing</h3>
              <p className="text-muted-foreground">
                You authorize Cross Life School of Divinity to automatically charge your payment method on file for the monthly payment amount 
                on the same day each month until the payment plan is completed. You will receive email receipts for each payment.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Missed Payments</h3>
              <p className="text-muted-foreground">
                If a scheduled payment fails, you will be notified via email. Your course access will be paused until the payment is brought current. 
                No late fees or penalties will be assessed. Once payment is received, access will be restored immediately.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. Early Payoff</h3>
              <p className="text-muted-foreground">
                You may pay off the remaining balance of your payment plan at any time without penalty or additional fees. 
                Contact support or use the "Pay Off Early" option in your student dashboard to complete early payoff.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Interest-Free Financing</h3>
              <p className="text-muted-foreground">
                This payment plan is offered at <strong>0% interest</strong>. The total amount you will pay over {months} months 
                equals the full program price of ${totalAmount.toFixed(2)}. There are no hidden fees or finance charges.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. Refund Policy</h3>
              <p className="text-muted-foreground">
                <strong>No refunds will be issued after 7 days from the date of enrollment.</strong> If you wish to cancel within the first 7 days, 
                contact support for a full refund of payments made. After 7 days, all payments are non-refundable, but you may cancel future payments 
                and retain access to course materials already paid for.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. Cancellation</h3>
              <p className="text-muted-foreground">
                You may cancel your payment plan at any time by contacting support. Upon cancellation, no future payments will be charged. 
                You will retain access to course materials for which you have already paid, but will not be able to access additional content 
                or earn certificates until the full program cost is paid.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. Student Responsibilities</h3>
              <p className="text-muted-foreground">
                You agree to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Maintain a valid payment method on file</li>
                <li>Update payment information if your card expires or changes</li>
                <li>Notify us of any billing issues or disputes within 30 days</li>
                <li>Comply with all course policies and academic integrity standards</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">10. Electronic Signature</h3>
              <p className="text-muted-foreground">
                By checking the acceptance box below, you acknowledge that you have read, understood, and agree to be bound by the terms of this 
                Tuition Assistance Agreement. Your electronic acceptance constitutes a legally binding signature.
              </p>
            </section>

            <section className="mt-4 p-3 bg-accent/10 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Questions?</strong> If you have any questions about this payment plan or agreement, please contact us at 
                support@crosslifeschool.org before proceeding with enrollment.
              </p>
            </section>
          </div>
        </ScrollArea>

        {!hasScrolled && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please scroll through and read the entire agreement before accepting.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-start space-x-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
          <Checkbox
            id="accept-agreement"
            checked={accepted}
            onCheckedChange={(checked) => onAcceptChange(checked === true)}
            disabled={!hasScrolled}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="accept-agreement"
              className={`text-sm font-medium leading-relaxed ${!hasScrolled ? 'text-muted-foreground' : 'cursor-pointer'}`}
            >
              I have read and agree to the Cross Life Tuition Assistance Agreement
            </Label>
            <p className="text-xs text-muted-foreground">
              By checking this box, I acknowledge that I understand and accept all terms and conditions outlined above, 
              including the payment schedule, refund policy, and my responsibilities as a student.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
