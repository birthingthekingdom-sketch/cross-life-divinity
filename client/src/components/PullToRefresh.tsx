import { ReactNode } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { Loader2, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  enabled?: boolean;
}

export function PullToRefresh({ onRefresh, children, enabled = true }: PullToRefreshProps) {
  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh,
    enabled
  });

  return (
    <div className="relative">
      {/* Pull indicator */}
      <div
        className="fixed top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-50"
        style={{
          height: `${Math.min(pullDistance, 80)}px`,
          opacity: pullDistance > 0 ? 1 : 0,
          transform: `translateY(${Math.min(pullDistance - 80, 0)}px)`
        }}
      >
        <div className="bg-background/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-border">
          {isRefreshing ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : isPulling ? (
            <ArrowDown className="h-5 w-5 text-primary animate-bounce" />
          ) : (
            <ArrowDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
