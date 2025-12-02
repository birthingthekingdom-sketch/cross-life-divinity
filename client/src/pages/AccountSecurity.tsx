import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { 
  Shield, 
  Key, 
  History, 
  Monitor, 
  MapPin, 
  Calendar,
  AlertTriangle 
} from 'lucide-react';

export default function AccountSecurity() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { data: loginHistory, isLoading } = trpc.auth.getLoginHistory.useQuery();
  
  const changePasswordMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    changePasswordMutation.mutate({
      oldPassword,
      newPassword,
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Account Security
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your password and view your account activity
          </p>
        </div>

        {/* Change Password Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1"
              />
            </div>

            <Button 
              type="submit" 
              disabled={changePasswordMutation.isPending}
              className="w-full sm:w-auto"
            >
              {changePasswordMutation.isPending ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </Card>

        {/* Login History Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <History className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">Login History</h2>
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading login history...</p>
          ) : !loginHistory || loginHistory.length === 0 ? (
            <p className="text-gray-500">No login history available</p>
          ) : (
            <div className="space-y-4">
              {loginHistory.map((entry: any) => (
                <div 
                  key={entry.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {entry.userAgent ? 
                            entry.userAgent.split(' ')[0] || 'Unknown Browser' : 
                            'Unknown Browser'
                          }
                        </span>
                        {!entry.success && (
                          <span className="flex items-center gap-1 text-red-600 text-sm">
                            <AlertTriangle className="h-3 w-3" />
                            Failed Login
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{entry.ipAddress || 'Unknown IP'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(entry.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {entry.loginMethod && (
                        <div className="text-sm text-gray-500">
                          Login method: {entry.loginMethod}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Security Tips */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Security Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Use a strong, unique password for your account</li>
            <li>• Never share your password with anyone</li>
            <li>• Review your login history regularly for suspicious activity</li>
            <li>• Log out from shared or public computers</li>
            <li>• Contact support immediately if you notice unauthorized access</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
