import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Download, Smartphone } from "lucide-react";
import { promptInstall, isStandalone } from "@/registerSW";

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Don't show if already installed
    if (isStandalone()) {
      return;
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const android = /android/.test(userAgent);
    
    setIsIOS(ios);
    setIsAndroid(android);

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt if not dismissed or if it's been more than 7 days
    if (!dismissed || daysSinceDismissed > 7) {
      // Show after 30 seconds to not be intrusive
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);

      return () => clearTimeout(timer);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      const success = await promptInstall();
      if (success) {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md animate-in slide-in-from-bottom-5">
      <Card className="shadow-2xl border-2 border-primary/20">
        <CardHeader className="relative pb-3">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Install App</CardTitle>
              <CardDescription>Access courses offline</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isIOS ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Install this app on your iPhone for quick access and offline learning:
              </p>
              <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Tap the <strong className="text-foreground">Share</strong> button <span className="inline-block">⎋</span> at the bottom</li>
                <li>Scroll and tap <strong className="text-foreground">"Add to Home Screen"</strong></li>
                <li>Tap <strong className="text-foreground">"Add"</strong> to confirm</li>
              </ol>
            </div>
          ) : isAndroid && deferredPrompt ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Install this app for quick access and offline learning
              </p>
              <Button 
                onClick={handleInstall} 
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Add this app to your home screen for:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Quick access from home screen</li>
                <li>✓ Offline course access</li>
                <li>✓ Full screen experience</li>
                <li>✓ Push notifications</li>
              </ul>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={handleDismiss}
            className="w-full"
            size="sm"
          >
            Maybe Later
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
