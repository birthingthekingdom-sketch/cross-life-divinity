import React from 'react';
import { AdminIdReviewDashboard } from '@/components/AdminIdReviewDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminIdVerification() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ID Verification Management
          </h1>
          <p className="text-gray-600">
            Review and manage student ID submissions
          </p>
        </div>

        <AdminIdReviewDashboard />
      </div>
    </div>
  );
}
