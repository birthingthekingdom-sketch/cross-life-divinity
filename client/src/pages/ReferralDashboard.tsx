import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, TrendingUp, Users, Award, DollarSign } from 'lucide-react';

export default function ReferralDashboard() {
  const [copied, setCopied] = useState(false);
  
  // Get referral code
  const { data: referralData, isLoading: codeLoading } = trpc.referrals.getReferralCode.useQuery();
  
  // Get user credits
  const { data: creditsData, isLoading: creditsLoading } = trpc.referrals.getUserCredits.useQuery();
  
  // Get referrals list
  const { data: referralsList, isLoading: listLoading } = trpc.referrals.getUserReferrals.useQuery();

  const copyToClipboard = () => {
    if (referralData?.referralUrl) {
      navigator.clipboard.writeText(referralData.referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnSocial = (platform: string) => {
    const text = `Join me at Cross Life School of Divinity! Use my referral code: ${referralData?.code}`;
    const url = referralData?.referralUrl || '';
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent('Join Cross Life School of Divinity')}&body=${encodeURIComponent(text + '\n\n' + url)}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const isLoading = codeLoading || creditsLoading || listLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Referral Rewards Program</h1>
          <p className="text-lg text-slate-600">Earn $50 in credits for every student you refer</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Total Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {referralsList?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {referralsList?.filter((r: any) => r.status === 'completed').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Credits Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                ${(referralsList?.filter((r: any) => r.status === 'completed').length || 0) * 50}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-500" />
                Available Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                ${creditsData?.availableCredits || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="bg-white border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-500" />
              Your Referral Link
            </CardTitle>
            <CardDescription>
              Share this link with friends and earn $50 for each successful referral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Referral Code</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-white px-3 py-2 rounded border border-slate-200 font-mono text-sm font-semibold text-slate-900">
                  {referralData?.code}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Full Referral Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralData?.referralUrl || ''}
                  readOnly
                  className="flex-1 bg-white px-3 py-2 rounded border border-slate-200 text-sm text-slate-900"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('facebook')}
                className="gap-2"
              >
                Share on Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('twitter')}
                className="gap-2"
              >
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('linkedin')}
                className="gap-2"
              >
                Share on LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('email')}
                className="gap-2"
              >
                Share via Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>
              Track the status of all your referrals and earned credits
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referralsList && referralsList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Referred User</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Credits</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralsList.map((referral: any) => (
                      <tr key={referral.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-900">
                          {referral.referredUserName || 'Pending'}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {referral.referredUserEmail || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={referral.status === 'completed' ? 'default' : 'secondary'}
                            className={referral.status === 'completed' ? 'bg-green-500' : ''}
                          >
                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {referral.status === 'completed' ? '$50' : '-'}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No referrals yet</p>
                <p className="text-sm text-slate-500">
                  Start sharing your referral link to earn credits!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
