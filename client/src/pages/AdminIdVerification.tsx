import { AdminRoute } from '@/components/AdminRoute';
import { AdminIdVerificationDashboard } from '@/components/AdminIdVerificationDashboard';

export function AdminIdVerification() {
  return (
    <AdminRoute>
      <div className="space-y-6">
        <AdminIdVerificationDashboard />
      </div>
    </AdminRoute>
  );
}
