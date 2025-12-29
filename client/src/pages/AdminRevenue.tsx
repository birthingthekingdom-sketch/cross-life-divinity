import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Users, ShoppingCart, CreditCard, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { format } from "date-fns";

export default function AdminRevenue() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not admin
  if (user?.role !== "admin") {
    setLocation("/dashboard");
    return null;
  }

  const { data: subscriptions } = trpc.admin.getAllSubscriptions.useQuery();
  const { data: purchases } = trpc.admin.getAllPurchases.useQuery();

  // Calculate metrics
  const activeSubscriptions = subscriptions?.filter(s => s.status === "active") || [];
  const canceledSubscriptions = subscriptions?.filter(s => s.cancelAtPeriodEnd) || [];
  const completedPurchases = purchases?.filter(p => p.status === "completed") || [];
  
  const mrr = activeSubscriptions.length * 49; // $49 per subscription
  const totalRevenue = completedPurchases.reduce((sum: number, p) => sum + p.amount, 0) / 100;
  
  // Calculate monthly revenue
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyPurchases = completedPurchases.filter(p => {
    const purchaseDate = new Date(p.purchasedAt);
    return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
  });
  
  const monthlyRevenue = monthlyPurchases.reduce((sum: number, p) => sum + p.amount, 0) / 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue & Subscriptions</h1>
        <p className="text-muted-foreground">Monitor payment performance and subscription metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All-time course purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {format(now, "MMMM yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              {canceledSubscriptions.length} pending cancellation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mrr.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {activeSubscriptions.length} subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
          <CardDescription>Current status of all subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions && subscriptions.length > 0 ? (
              <div className="space-y-3">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">User ID: {sub.userId}</p>
                        <Badge
                          variant={sub.status === "active" ? "default" : "secondary"}
                          className={
                            sub.status === "active"
                              ? "bg-green-600"
                              : sub.status === "canceled"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                          }
                        >
                          {sub.status}
                        </Badge>
                        {sub.cancelAtPeriodEnd && (
                          <Badge variant="outline" className="border-amber-500 text-amber-600">
                            Canceling
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Started: {format(new Date(sub.createdAt), "MMM d, yyyy")}
                        </span>
                        <span>
                          Current period: {format(new Date(sub.currentPeriodStart), "MMM d")} -{" "}
                          {format(new Date(sub.currentPeriodEnd), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">$49/mo</p>
                      <p className="text-xs text-muted-foreground">
                        Stripe ID: {sub.stripeSubscriptionId.substring(0, 12)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No subscriptions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Course Purchases */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Course Purchases</CardTitle>
          <CardDescription>Individual course purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedPurchases && completedPurchases.length > 0 ? (
              <div className="space-y-3">
                {completedPurchases.slice(0, 10).map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">User ID: {purchase.userId}</p>
                        <p className="text-sm text-muted-foreground">Course ID: {purchase.courseId}</p>
                        <Badge className="bg-green-600">Completed</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(purchase.purchasedAt), "MMM d, yyyy 'at' h:mm a")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${(purchase.amount / 100).toFixed(2)}</p>
                      {purchase.stripePaymentIntentId && (
                        <p className="text-xs text-muted-foreground">
                          {purchase.stripePaymentIntentId.substring(0, 12)}...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No course purchases yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Course purchases vs subscription revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold">Course Purchases</p>
                  <p className="text-sm text-muted-foreground">{completedPurchases.length} total purchases</p>
                </div>
              </div>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">Subscription Revenue (MRR)</p>
                  <p className="text-sm text-muted-foreground">{activeSubscriptions.length} active subscriptions</p>
                </div>
              </div>
              <p className="text-2xl font-bold">${mrr.toFixed(2)}/mo</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold">Projected Annual Revenue</p>
                  <p className="text-sm text-muted-foreground">Based on current MRR</p>
                </div>
              </div>
              <p className="text-2xl font-bold">${(mrr * 12).toFixed(2)}/yr</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
