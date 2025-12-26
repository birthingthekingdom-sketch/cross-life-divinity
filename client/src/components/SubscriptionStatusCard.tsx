import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function SubscriptionStatusCard() {
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  // Fetch subscription status
  const { data: statusInfo, isLoading } = trpc.subscriptionStatus.getStatus.useQuery();

  // Get payment method update URL
  const updatePaymentUrl = trpc.subscriptionStatus.getPaymentMethodUpdateUrl.useQuery();

  const handleUpdatePayment = () => {
    setIsUpdatingPayment(true);
    if (updatePaymentUrl.data?.url) {
      window.location.href = updatePaymentUrl.data.url;
    } else {
      toast.error("Could not open payment method update page");
      setIsUpdatingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!statusInfo) {
    return null;
  }

  const { subscription, accessStatus, displayStatus, message } = statusInfo;
  const isActive = accessStatus.status === "active";
  const isSuspended = accessStatus.status === "suspended";
  const isFailed = accessStatus.status === "failed";

  // Determine badge color and icon
  const getBadgeVariant = () => {
    if (isActive) return "default";
    if (isSuspended || isFailed) return "destructive";
    return "secondary";
  };

  const getStatusIcon = () => {
    if (isActive) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (isSuspended) return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (isFailed) return <AlertCircle className="h-5 w-5 text-orange-600" />;
    return <Clock className="h-5 w-5 text-gray-600" />;
  };

  return (
    <Card className={isSuspended || isFailed ? "border-red-200 bg-red-50" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Subscription Status
          </CardTitle>
          <Badge variant={getBadgeVariant() as any}>{displayStatus}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status message */}
        <p className="text-sm text-muted-foreground">{message}</p>

        {/* Active subscription details */}
        {isActive && subscription && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Period:</span>
              <span>
                {new Date(subscription.currentPeriodStart).toLocaleDateString()} -{" "}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Suspended/Failed subscription details */}
        {(isSuspended || isFailed) && (
          <div className="space-y-3 bg-white p-3 rounded border border-red-200">
            {accessStatus.failedPaymentAttempts !== undefined && (
              <div className="text-sm">
                <span className="text-muted-foreground">Failed Attempts:</span>
                <span className="ml-2 font-medium">
                  {accessStatus.failedPaymentAttempts}/3
                </span>
              </div>
            )}

            {accessStatus.nextRetryDate && (
              <div className="text-sm">
                <span className="text-muted-foreground">Next Retry:</span>
                <span className="ml-2 font-medium">
                  {new Date(accessStatus.nextRetryDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {subscription?.lastPaymentFailureReason && (
              <div className="text-sm">
                <span className="text-muted-foreground">Reason:</span>
                <span className="ml-2 font-medium">{subscription.lastPaymentFailureReason}</span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          {(isSuspended || isFailed) && (
            <Button
              onClick={handleUpdatePayment}
              disabled={isUpdatingPayment}
              className="flex-1"
              variant="destructive"
            >
              {isUpdatingPayment ? "Opening..." : "Update Payment Method"}
            </Button>
          )}

          {isActive && (
            <Button
              onClick={handleUpdatePayment}
              disabled={isUpdatingPayment}
              variant="outline"
              className="flex-1"
            >
              {isUpdatingPayment ? "Opening..." : "Manage Subscription"}
            </Button>
          )}
        </div>

        {/* Access status indicator */}
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm">
            {accessStatus.hasAccess ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">You have access to all courses</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700">Your course access is suspended</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
