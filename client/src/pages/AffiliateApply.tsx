import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Users, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

export default function AffiliateApply() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'church' as 'church' | 'ministry' | 'nonprofit' | 'individual' | 'other',
    website: '',
    description: '',
    expectedReferrals: '',
    paymentMethod: 'paypal' as 'paypal' | 'bank_transfer' | 'check',
    paymentDetails: '',
  });

  const applyMutation = trpc.affiliate.applyForAffiliate.useMutation({
    onSuccess: () => {
      toast.success('Application submitted successfully! We\'ll review it and get back to you soon.');
      setLocation('/affiliate/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await applyMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Become an Affiliate Partner
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Partner with Cross Life School of Divinity and earn commissions while helping your community access quality theological education.
          </p>
          
          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle className="text-lg">Generous Commissions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Earn 25% on subscriptions and 35% on individual course sales</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Recurring Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Monthly recurring commissions for the lifetime of each subscription</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Support Your Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Generate sustainable funding for your ministry or organization</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Application Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Affiliate Application</CardTitle>
            <CardDescription>
              Tell us about your organization and how you plan to promote our courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="Your Church or Ministry Name"
                  required
                />
              </div>

              {/* Organization Type */}
              <div className="space-y-2">
                <Label htmlFor="organizationType">Organization Type *</Label>
                <Select
                  value={formData.organizationType}
                  onValueChange={(value: any) => setFormData({ ...formData, organizationType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="church">Church</SelectItem>
                    <SelectItem value="ministry">Ministry</SelectItem>
                    <SelectItem value="nonprofit">Nonprofit Organization</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourchurch.org"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Tell Us About Your Organization *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your organization, mission, and audience..."
                  rows={4}
                  required
                />
              </div>

              {/* Expected Referrals */}
              <div className="space-y-2">
                <Label htmlFor="expectedReferrals">Expected Monthly Referrals *</Label>
                <Select
                  value={formData.expectedReferrals}
                  onValueChange={(value) => setFormData({ ...formData, expectedReferrals: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expected referrals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 students per month</SelectItem>
                    <SelectItem value="6-10">6-10 students per month</SelectItem>
                    <SelectItem value="11-20">11-20 students per month</SelectItem>
                    <SelectItem value="21-50">21-50 students per month</SelectItem>
                    <SelectItem value="50+">50+ students per month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Preferred Payment Method *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value: any) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Details */}
              <div className="space-y-2">
                <Label htmlFor="paymentDetails">Payment Details *</Label>
                <Textarea
                  id="paymentDetails"
                  value={formData.paymentDetails}
                  onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
                  placeholder="PayPal email, bank account details, or mailing address for checks..."
                  rows={3}
                  required
                />
                <p className="text-sm text-slate-500">
                  This information is kept confidential and used only for commission payments
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Apply</h3>
              <p className="text-sm text-slate-600">Submit your application and wait for approval</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Get Your Link</h3>
              <p className="text-sm text-slate-600">Receive your unique affiliate tracking link</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Share & Promote</h3>
              <p className="text-sm text-slate-600">Share with your community and audience</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Earn Commissions</h3>
              <p className="text-sm text-slate-600">Get paid monthly for every referral</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
