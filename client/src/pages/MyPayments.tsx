import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Calendar, CreditCard, DollarSign, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PAYMENT_PLANS } from "@shared/const";

export default function MyPayments() {
  const { data: plans, isLoading } = trpc.paymentPlan.getMyPlans.useQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const { data: history } = trpc.paymentPlan.getPaymentHistory.useQuery(
    { planId: selectedPlanId! },
    { enabled: !!selectedPlanId }
  );

  const cancelPlan = trpc.paymentPlan.cancelPlan.useMutation({
    onSuccess: () => {
      toast.success("Payment plan cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-600">Paused</Badge>;
      case 'completed':
        return <Badge className="bg-blue-600">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading payment plans...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Payments</h1>
          <p className="text-slate-400">Manage your payment plans and view payment history</p>
        </div>

        {!plans || plans.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="w-16 h-16 text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg mb-2">No payment plans found</p>
              <p className="text-slate-500 text-sm">You don't have any active payment plans yet.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Active Payment Plans */}
            <div className="grid gap-6">
              {plans.map((plan: any) => {
                const config = PAYMENT_PLANS[plan.planType as keyof typeof PAYMENT_PLANS];
                const remainingAmount = plan.monthlyAmount * plan.paymentsRemaining;
                const progressPercent = (plan.paymentsCompleted / plan.paymentsTotal) * 100;

                return (
                  <Card key={plan.id} className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-xl">
                            {plan.planType ? plan.planType.replace(/_/g, ' ') : 'Payment Plan'}
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Started {formatDate(plan.createdAt)}
                          </CardDescription>
                        </div>
                        {getStatusBadge(plan.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm text-slate-400 mb-2">
                          <span>Payment Progress</span>
                          <span>{plan.paymentsCompleted} of {plan.paymentsTotal} payments</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div
                            className="bg-green-600 h-3 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Payment Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm">Monthly Payment</span>
                          </div>
                          <p className="text-2xl font-bold text-white">
                            ${(plan.monthlyAmount / 100).toFixed(2)}
                          </p>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Next Payment</span>
                          </div>
                          <p className="text-lg font-semibold text-white">
                            {plan.status === 'active' ? formatDate(plan.nextPaymentDate) : 'N/A'}
                          </p>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Remaining Balance</span>
                          </div>
                          <p className="text-2xl font-bold text-white">
                            ${(remainingAmount / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Status Messages */}
                      {plan.status === 'paused' && (
                        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                          <div>
                            <p className="text-yellow-200 font-semibold mb-1">Payment Failed - Access Paused</p>
                            <p className="text-yellow-300 text-sm">
                              Your last payment failed. Please update your payment method to resume access.
                            </p>
                          </div>
                        </div>
                      )}

                      {plan.status === 'completed' && (
                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                          <div>
                            <p className="text-green-200 font-semibold mb-1">Payment Plan Completed!</p>
                            <p className="text-green-300 text-sm">
                              Congratulations! You've completed all payments for this plan.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedPlanId(plan.id)}
                          className="flex-1"
                        >
                          View Payment History
                        </Button>
                        {plan.status === 'active' && plan.paymentsRemaining > 0 && (
                          <>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => toast.info("Early payoff coming soon")}
                            >
                              Pay Off Early
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => cancelPlan.mutate({ planId: plan.id })}
                              disabled={cancelPlan.isPending}
                            >
                              Cancel Plan
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Payment History */}
            {selectedPlanId && history && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Payment History</CardTitle>
                  <CardDescription className="text-slate-400">
                    Detailed transaction history for this payment plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-400">Date</TableHead>
                        <TableHead className="text-slate-400">Payment #</TableHead>
                        <TableHead className="text-slate-400">Amount</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Transaction ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((payment: any) => (
                        <TableRow key={payment.id} className="border-slate-700">
                          <TableCell className="text-slate-300">
                            {formatDate(payment.paymentDate)}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            Payment {payment.paymentNumber}
                          </TableCell>
                          <TableCell className="text-slate-300 font-semibold">
                            ${(payment.amount / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {payment.status === 'succeeded' ? (
                              <Badge className="bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge className="bg-red-600">
                                <XCircle className="w-3 h-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-slate-400 text-xs font-mono">
                            {payment.stripePaymentIntentId?.slice(0, 20)}...
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
