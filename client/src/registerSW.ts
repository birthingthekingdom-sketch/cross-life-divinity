export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered:', registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error('[SW] Service Worker registration failed:', error);
        });
    });
  }
}

// Install prompt for PWA
let deferredPrompt: any;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button or banner
    showInstallPromotion();
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App was installed');
    deferredPrompt = null;
  });
}

function showInstallPromotion() {
  // This could trigger a custom install banner/button
  console.log('[PWA] Install prompt available');
}

export async function promptInstall() {
  if (!deferredPrompt) {
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`[PWA] User response to install prompt: ${outcome}`);

  // Clear the deferred prompt
  deferredPrompt = null;

  return outcome === 'accepted';
}

// Check if app is installed
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

// Network status detection
export function setupNetworkDetection() {
  window.addEventListener('online', () => {
    console.log('[Network] Back online');
    // Trigger sync of offline data
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        return (registration as any).sync.register('sync-progress');
      });
    }
  });

  window.addEventListener('offline', () => {
    console.log('[Network] Gone offline');
  });
}
