import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { Shield, User } from 'lucide-react';

export default function ToggleRole() {
  const { user, refresh } = useAuth();
  const [isToggling, setIsToggling] = useState(false);

  const toggleMutation = trpc.toggleAdmin.toggleMyRole.useMutation({
    onSuccess: async (data) => {
      toast.success(data.message);
      setIsToggling(false);
      // Refresh user data
      await refresh();
      // Redirect based on new role
      window.location.href = data.newRole === 'admin' ? '/admin' : '/dashboard';
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to toggle role');
      setIsToggling(false);
    },
  });

  const handleToggle = () => {
    setIsToggling(true);
    toggleMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            {user?.role === 'admin' ? (
              <Shield className="h-16 w-16 text-blue-600" />
            ) : (
              <User className="h-16 w-16 text-green-600" />
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">Role Toggle</h1>
            <p className="text-muted-foreground">
              Current Role: <span className="font-semibold text-foreground">{user?.role || 'Unknown'}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg text-sm text-left space-y-2">
            <p><strong>Admin Role:</strong> Full access to admin panel, course management, analytics, grading</p>
            <p><strong>Student Role:</strong> Access to enrolled courses, lessons, assignments, certificates</p>
          </div>

          <Button
            onClick={handleToggle}
            disabled={isToggling}
            className="w-full"
            size="lg"
          >
            {isToggling ? 'Switching...' : `Switch to ${user?.role === 'admin' ? 'Student' : 'Admin'}`}
          </Button>

          <p className="text-xs text-muted-foreground">
            This page allows you to switch between admin and student views for testing purposes.
          </p>
        </div>
      </Card>
    </div>
  );
}
