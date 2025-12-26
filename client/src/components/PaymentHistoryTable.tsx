import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export function PaymentHistoryTable() {
  const { data: payments, isLoading } = trpc.subscriptionStatus.getPaymentHistory.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No payment history available</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return <Badge className="bg-green-100 text-green-800">Succeeded</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "refunded":
        return <Badge variant="outline">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {payments.map((payment: any) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-3 border rounded hover:bg-muted/50"
            >
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(payment.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Payment #{payment.paymentNumber || "—"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString()}
                    </span>
                  </div>
                  {payment.failureReason && (
                    <p className="text-xs text-red-600 mt-1">{payment.failureReason}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">${payment.amount.toFixed(2)}</span>
                {getStatusBadge(payment.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
