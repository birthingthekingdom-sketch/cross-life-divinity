import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from 'wouter';
import { 
  DollarSign, 
  Users, 
  MousePointerClick, 
  TrendingUp, 
  Copy, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { PublicNav } from '@/components/PublicNav';

export default function AffiliateDashboard() {
  const [, setLocation] = useLocation();
  const [copiedCode, setCopiedCode] = useState(false);

  const { data: affiliate, isLoading: affiliateLoading } = trpc.affiliate.getMyAffiliate.useQuery();
  const { data: dashboardData, isLoading: statsLoading } = trpc.affiliate.getDashboardStats.useQuery();
  const { data: referrals } = trpc.affiliate.getMyReferrals.useQuery();
  const { data: commissions } = trpc.affiliate.getMyCommissions.useQuery();

  const isLoading = affiliateLoading || statsLoading;

  // If no affiliate account, redirect to apply page
  useEffect(() => {
    if (!isLoading && !affiliate) {
      setLocation('/affiliate/apply');
    }
  }, [isLoading, affiliate, setLocation]);

  const copyAffiliateLink = () => {
    if (affiliate) {
      const link = `${window.location.origin}/?ref=${affiliate.affiliateCode}`;
      navigator.clipboard.writeText(link);
      setCopiedCode(true);
      toast.success('Affiliate link copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const copyAffiliateCode = () => {
    if (affiliate) {
      navigator.clipboard.writeText(affiliate.affiliateCode);
      toast.success('Affiliate code copied!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && !affiliate) {
    return null;
  }

  const stats = dashboardData?.stats;
  const status = affiliate?.status;

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNav currentPage="about" />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Affiliate Dashboard</h1>
          <p className="text-slate-600">
            {affiliate?.organizationName || 'Your Organization'}
          </p>
        </div>

        {/* Status Alert */}
        {status === 'pending' && (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-4 py-4">
              <Clock className="h-6 w-6 text-amber-600" />
              <div>
                <h3 className="font-semibold text-amber-900">Application Pending</h3>
                <p className="text-sm text-amber-700">
                  Your affiliate application is under review. We'll notify you once it's approved.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {status === 'rejected' && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-4 py-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Application Rejected</h3>
                <p className="text-sm text-red-700">
                  {affiliate?.rejectionReason || 'Your application was not approved at this time.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {status === 'suspended' && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-4 py-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Account Suspended</h3>
                <p className="text-sm text-red-700">
                  {affiliate?.suspensionReason || 'Your affiliate account has been suspended.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Affiliate Link Card */}
        {status === 'active' && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle>Your Affiliate Link</CardTitle>
              <CardDescription>Share this link to earn commissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 bg-white border rounded-lg px-4 py-3 font-mono text-sm">
                  {window.location.origin}/?ref={affiliate?.affiliateCode}
                </div>
                <Button onClick={copyAffiliateLink} variant="outline">
                  {copiedCode ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Your Code:</span>
                <code className="bg-white px-3 py-1 rounded border font-mono text-sm">
                  {affiliate?.affiliateCode}
                </code>
                <Button size="sm" variant="ghost" onClick={copyAffiliateCode}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        {status === 'active' && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${((stats?.totalEarnings || 0) / 100).toFixed(2)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${((stats?.pendingEarnings || 0) / 100).toFixed(2)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Awaiting payout</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalReferrals || 0}</div>
                  <p className="text-xs text-slate-500 mt-1">
                    {stats?.activeReferrals || 0} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.conversionRate || 0}%</div>
                  <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Referrals */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
                <CardDescription>Students who signed up using your link</CardDescription>
              </CardHeader>
              <CardContent>
                {referrals && referrals.length > 0 ? (
                  <div className="space-y-4">
                    {referrals.slice(0, 10).map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div>
                          <p className="font-medium">{referral.referredUserName || 'Anonymous'}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(referral.referralDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.status === 'converted' 
                              ? 'bg-green-100 text-green-800' 
                              : referral.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {referral.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-8">
                    No referrals yet. Start sharing your affiliate link!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Commissions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Commissions</CardTitle>
                <CardDescription>Your earnings history</CardDescription>
              </CardHeader>
              <CardContent>
                {commissions && commissions.length > 0 ? (
                  <div className="space-y-4">
                    {commissions.slice(0, 10).map((commission) => (
                      <div key={commission.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div>
                          <p className="font-medium">${(Number(commission.amount) / 100).toFixed(2)}</p>
                          <p className="text-sm text-slate-500">
                            {commission.type} • {new Date(commission.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            commission.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : commission.status === 'approved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {commission.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-8">
                    No commissions yet. Keep promoting!
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
