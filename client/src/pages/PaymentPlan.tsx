import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Calendar, CheckCircle2, XCircle, Clock, DollarSign, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function PaymentPlan() {
  const { data: plans, isLoading } = trpc.installmentPlan.getMyPlans.useQuery();

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-12">
        <div className="text-center">Loading your payment plans...</div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>No Payment Plans</CardTitle>
            <CardDescription>You don't have any active payment plans</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pricing">
              <Button>Browse Bundles</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Payment Plans</h1>
        <p className="text-muted-foreground">
          Manage your installment payment plans and view payment history
        </p>
      </div>

      <div className="space-y-6">
        {plans.map((plan: any) => (
          <PaymentPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}

function PaymentPlanCard({ plan }: { plan: any }) {
  const { data: transactions } = trpc.installmentPlan.getPlanTransactions.useQuery({
    planId: plan.id,
  });

  const cancelMutation = trpc.installmentPlan.cancelPlan.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const progress = (plan.paymentsCompleted / plan.paymentsTotal) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{plan.bundleName}</CardTitle>
            <CardDescription>
              6-Month Installment Plan • ${(plan.monthlyAmount / 100).toFixed(2)}/month
            </CardDescription>
          </div>
          {getStatusBadge(plan.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">
              Payment Progress: {plan.paymentsCompleted} of {plan.paymentsTotal}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-accent/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              Total Amount
            </div>
            <div className="text-2xl font-bold">${(plan.totalAmount / 100).toFixed(2)}</div>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CreditCard className="h-4 w-4" />
              Monthly Payment
            </div>
            <div className="text-2xl font-bold">${(plan.monthlyAmount / 100).toFixed(2)}</div>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              Next Payment
            </div>
            <div className="text-2xl font-bold">
              {plan.status === 'active'
                ? new Date(plan.nextPaymentDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A'}
            </div>
          </div>
        </div>

        {/* Payment History */}
        {transactions && transactions.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Payment History</h3>
            <div className="space-y-2">
              {transactions.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-accent/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {transaction.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : transaction.status === 'failed' ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <div className="font-medium">
                        ${(transaction.amount / 100).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.paymentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      transaction.status === 'completed'
                        ? 'default'
                        : transaction.status === 'failed'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {plan.status === 'active' && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => {
                if (
                  confirm(
                    'Are you sure you want to cancel this payment plan? You will lose access to the bundle courses.'
                  )
                ) {
                  cancelMutation.mutate({ planId: plan.id });
                }
              }}
              disabled={cancelMutation.isPending}
            >
              Cancel Plan
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">View Courses</Link>
            </Button>
          </div>
        )}

        {plan.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Payment plan completed!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              You have full access to all courses in this bundle.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
