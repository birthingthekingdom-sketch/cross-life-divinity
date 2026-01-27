import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  enabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPullDistance = 150,
  enabled = true
}: PullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let touchStartY = 0;
    let isAtTop = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Only activate if scrolled to top
      isAtTop = window.scrollY === 0;
      if (isAtTop) {
        touchStartY = e.touches[0].clientY;
        startY.current = touchStartY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isAtTop || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      if (distance > 0) {
        // Prevent default scroll behavior when pulling down
        e.preventDefault();
        
        // Apply resistance curve
        const resistance = 0.5;
        const adjustedDistance = Math.min(
          distance * resistance,
          maxPullDistance
        );
        
        setPullDistance(adjustedDistance);
        setIsPulling(adjustedDistance > threshold);
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setPullDistance(0);
      setIsPulling(false);
      startY.current = 0;
      currentY.current = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, onRefresh, threshold, maxPullDistance, pullDistance, isRefreshing]);

  return {
    isPulling,
    pullDistance,
    isRefreshing
  };
}
