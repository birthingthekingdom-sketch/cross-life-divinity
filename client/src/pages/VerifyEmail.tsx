import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  // Get token from URL query params
  const token = new URLSearchParams(window.location.search).get('token');

  const verifyMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setStatus('success');
      setMessage('Your email has been verified successfully!');
      // Redirect to login after 3 seconds
      setTimeout(() => {
        setLocation('/login');
      }, 3000);
    },
    onError: (error: any) => {
      setStatus('error');
      setMessage(error.message || 'Email verification failed');
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

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
          {status === 'verifying' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              <p className="text-gray-600">Verifying your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
              <p className="text-gray-800 font-medium">{message}</p>
              <p className="text-sm text-gray-600">Redirecting to login page...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-red-600" />
              <p className="text-gray-800 font-medium">{message}</p>
              <div className="flex gap-3 mt-4">
                <Link href="/login">
                  <Button>Go to Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline">Register Again</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
