import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Cross Life School of Divinity" 
              className="h-16 w-auto"
            />
          </div>

          <h1 className="text-2xl font-bold">Email Verification</h1>

          {/* Status Display */}
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
            <p className="text-gray-800 font-medium">Email verification is no longer required.</p>
            <p className="text-sm text-gray-600">You can now access your account directly.</p>
          </div>

          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
