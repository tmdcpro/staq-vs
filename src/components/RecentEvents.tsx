import React from 'react';
import { Clock, GitMerge, AlertTriangle, CheckCircle2, Play, TestTube } from 'lucide-react';

interface Event {
  timestamp: string;
  type: 'milestone' | 'merge' | 'test_failure' | 'experiment_start' | 'experiment_complete';
  experiment: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface RecentEventsProps {
  events: Event[];
}

const eventConfig = {
  milestone: { icon: CheckCircle2, color: 'text-success-DEFAULT bg-success-DEFAULT/10' },
  merge: { icon: GitMerge, color: 'text-primary-DEFAULT bg-primary-DEFAULT/10' },
  test_failure: { icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
  experiment_start: { icon: Play, color: 'text-warning-DEFAULT bg-warning-DEFAULT/10' },
  experiment_complete: { icon: CheckCircle2, color: 'text-success-DEFAULT bg-success-DEFAULT/10' }
};

const priorityColors = {
  high: 'border-red-500',
  medium: 'border-warning-DEFAULT',
  low: 'border-gray-300 dark:border-gray-600'
};

export function RecentEvents({ events }: RecentEventsProps) {
  return (
    <div className="bg-white dark:bg-card-dark rounded-lg shadow-card dark:shadow-none p-6 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent-purple/20">
          <Clock className="h-5 w-5 text-accent-purple" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Events</h3>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {events.map((event, index) => {
          const config = eventConfig[event.type];
          const Icon = config.icon;
          
          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${priorityColors[event.priority]} bg-gray-50 dark:bg-white/5 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-white/10`}
            >
              <div className={`p-2 rounded-lg ${config.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {event.experiment}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    event.priority === 'medium' ? 'bg-warning-light/20 text-warning-dark dark:text-warning-light' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {event.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {event.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {event.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}