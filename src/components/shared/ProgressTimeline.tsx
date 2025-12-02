'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProgressUpdate {
  progress: number;
  comment: string;
  date: Date | Timestamp;
}

interface ProgressTimelineProps {
  history: ProgressUpdate[];
  progress: number;
}

export function ProgressTimeline({
  history = [],
  progress = 0,
}: ProgressTimelineProps) {
  const sortedHistory = [...history].sort((a, b) => a.progress - b.progress);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="relative w-full h-2.5">
        {/* Base line */}
        <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full rounded-full bg-secondary" />

        {/* Progress fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />

        {/* History milestones */}
        {sortedHistory.map((item, index) => {
          const itemDate = item.date instanceof Timestamp ? item.date.toDate() : new Date(item.date);
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'absolute -top-1/2 w-4 h-4 rounded-full border-2 transition-transform duration-200 hover:scale-125',
                    item.progress <= progress ? 'bg-primary border-primary-foreground' : 'bg-secondary border-muted-foreground'
                  )}
                  style={{ left: `calc(${item.progress}% - 8px)` }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-bold">{item.progress}% - {format(itemDate, 'dd MMM yyyy', { locale: es })}</p>
                  <p className="text-xs text-muted-foreground italic">"{item.comment}"</p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Final progress indicator */}
        <div
          className="absolute -top-full w-5 h-5 rounded-full border-4 border-primary bg-primary-foreground shadow-lg"
          style={{ left: `calc(${progress}% - 10px)` }}
        />
      </div>
    </TooltipProvider>
  );
}
