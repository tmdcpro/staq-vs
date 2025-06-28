import React from 'react';
import { BarChart3, Target, Clock, TrendingUp } from 'lucide-react';

interface GraphMetricsProps {
  metrics: {
    totalNodes: number;
    totalEdges: number;
    nodesByStatus: Record<string, number>;
    edgesByType: Record<string, number>;
    completionRate: number;
    criticalPathLength: number;
    estimatedCompletion: string;
  };
}

export function GraphMetrics({ metrics }: GraphMetricsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3 max-w-xs">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
        <BarChart3 className="h-4 w-4" />
        Graph Metrics
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
          <div className="text-gray-500 dark:text-gray-400">Nodes</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {metrics.totalNodes}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
          <div className="text-gray-500 dark:text-gray-400">Edges</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {metrics.totalEdges}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <Target className="h-3 w-3 text-green-500" />
          <span className="text-gray-600 dark:text-gray-400">Completion</span>
          <span className="font-semibold text-gray-900 dark:text-white ml-auto">
            {(metrics.completionRate * 100).toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Clock className="h-3 w-3 text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">Est. Complete</span>
          <span className="font-semibold text-gray-900 dark:text-white ml-auto">
            {new Date(metrics.estimatedCompletion).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <TrendingUp className="h-3 w-3 text-purple-500" />
          <span className="text-gray-600 dark:text-gray-400">Critical Path</span>
          <span className="font-semibold text-gray-900 dark:text-white ml-auto">
            {metrics.criticalPathLength}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status Distribution</div>
        <div className="space-y-1">
          {Object.entries(metrics.nodesByStatus).map(([status, count]) => (
            <div key={status} className="flex justify-between text-xs">
              <span className="capitalize text-gray-600 dark:text-gray-400">{status}</span>
              <span className="font-medium text-gray-900 dark:text-white">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}