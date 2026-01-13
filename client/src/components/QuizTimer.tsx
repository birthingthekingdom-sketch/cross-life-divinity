import { useEffect, useState } from "react";
import { AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuizTimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export function QuizTimer({ totalSeconds, onTimeUp, isActive }: QuizTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        // Set warning when 5 minutes or less remain
        if (newTime <= 300 && newTime > 0) {
          setIsWarning(true);
        }
        
        // Call onTimeUp when time is up
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progressPercentage = (timeRemaining / totalSeconds) * 100;

  const getTimerColor = () => {
    if (timeRemaining <= 0) return "text-red-600";
    if (timeRemaining <= 60) return "text-red-600";
    if (timeRemaining <= 300) return "text-orange-600";
    return "text-green-600";
  };

  const getProgressColor = () => {
    if (progressPercentage <= 10) return "bg-red-500";
    if (progressPercentage <= 25) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${getTimerColor()}`} />
          <span className={`text-sm font-semibold ${getTimerColor()}`}>
            Time Remaining
          </span>
        </div>
        <div className={`text-2xl font-bold tabular-nums ${getTimerColor()}`}>
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      <Progress value={progressPercentage} className="h-2" />

      {isWarning && timeRemaining > 0 && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
          <p className="text-sm text-orange-700">
            {timeRemaining <= 60
              ? "Time is running out! Submit your answers soon."
              : "Less than 5 minutes remaining."}
          </p>
        </div>
      )}

      {timeRemaining <= 0 && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">
            Time is up! Your quiz has been submitted automatically.
          </p>
        </div>
      )}
    </div>
  );
}
