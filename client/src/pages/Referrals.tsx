import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Copy, DollarSign, Users, CheckCircle, Clock, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Referrals() {
  const { user } = useAuth();
  const { data: referralData } = trpc.referrals.getMyReferralCode.useQuery();
  const { data: credits } = trpc.referrals.getMyCredits.useQuery();
  const { data: referrals } = trpc.referrals.getMyReferrals.useQuery();

  const copyReferralLink = () => {
    if (referralData?.referralUrl) {
      navigator.clipboard.writeText(referralData.referralUrl);
      toast.success("Referral link copied to clipboard!");
    }
  };

  const shareReferralLink = async () => {
    if (referralData?.referralUrl && navigator.share) {
      try {
        await navigator.share({
          title: 'Join Cross Life School of Divinity',
          text: 'Start your theological education journey with CPD-accredited courses!',
          url: referralData.referralUrl,
        });
      } catch (error) {
        // User cancelled share or share not supported
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  const pendingReferrals = referrals?.filter(r => r.status === 'pending') || [];
  const completedReferrals = referrals?.filter(r => r.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Referral Program</h1>
            <p className="text-muted-foreground">Earn $50 for every friend who joins</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${credits?.availableCredits || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total earned: ${credits?.totalCredits || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Referrals</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedReferrals.length}</div>
              <p className="text-xs text-muted-foreground">
                ${completedReferrals.length * 50} earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Referrals</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReferrals.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting first purchase
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link with friends. You'll earn $50 when they register and make their first purchase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={referralData?.referralUrl || "Loading..."}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={copyReferralLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={shareReferralLink}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">How it works:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Share your unique referral link with friends</li>
                <li>They register using your link</li>
                <li>When they purchase their first course or subscription, you earn $50</li>
                <li>Credits can be applied to your future course purchases</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>Track your referral earnings and status</CardDescription>
          </CardHeader>
          <CardContent>
            {referrals && referrals.length > 0 ? (
              <div className="space-y-4">
                {referrals.map((referral: any) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{referral.referredUserName || "New User"}</p>
                        <p className="text-sm text-muted-foreground">
                          Registered on {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={referral.status === 'completed' ? 'default' : 'secondary'}
                      >
                        {referral.status === 'completed' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Earned $50
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No referrals yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Share your referral link to start earning!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
