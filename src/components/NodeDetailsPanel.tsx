import React from 'react';
import { X, GitBranch, Users, Clock, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import { GraphNode } from '../types/graph';
import { motion } from 'framer-motion';

interface NodeDetailsPanelProps {
  node: GraphNode;
  onClose: () => void;
}

export function NodeDetailsPanel({ node, onClose }: NodeDetailsPanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'active': return Clock;
      case 'failed': return AlertTriangle;
      default: return Target;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'active': return 'text-blue-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const StatusIcon = getStatusIcon(node.status);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Node Details
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Node Info */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              node.type === 'experiment' ? 'bg-blue-100 dark:bg-blue-900/30' :
              node.type === 'task' ? 'bg-green-100 dark:bg-green-900/30' :
              'bg-purple-100 dark:bg-purple-900/30'
            }`}>
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {node.label}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {node.type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <StatusIcon className={`h-4 w-4 ${getStatusColor(node.status)}`} />
            <span className={`text-sm font-medium capitalize ${getStatusColor(node.status)}`}>
              {node.status}
            </span>
          </div>

          {node.metadata.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded p-2">
              {node.metadata.notes}
            </p>
          )}
        </div>

        {/* Experiment Details */}
        {node.data.experiment && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Experiment Details
            </h5>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Approach</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {node.data.experiment.approach}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Progress</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${node.data.experiment.progress}%` }}
                        className="bg-blue-500 h-2 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {node.data.experiment.progress.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Quality Score</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {node.data.experiment.qualityScore.toFixed(1)}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Test Coverage</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {node.data.experiment.testCoverage.toFixed(1)}%
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Velocity</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {node.data.experiment.velocity.toFixed(1)}/day
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Risk Level</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  node.data.experiment.risk === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  node.data.experiment.risk === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {node.data.experiment.risk.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {node.data.experiment.team}
                </span>
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Estimated Completion</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {node.data.experiment.estimatedCompletion}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Task Details */}
        {node.data.task && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Task Details
            </h5>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Description</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {node.data.task.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Assignee</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {node.data.task.assignee}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Priority</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    node.data.task.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    node.data.task.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                    node.data.task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {node.data.task.priority.toUpperCase()}
                  </span>
                </div>

                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Estimated Hours</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {node.data.task.estimatedHours}h
                  </p>
                </div>

                {node.data.task.actualHours && (
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Actual Hours</label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {node.data.task.actualHours.toFixed(1)}h
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 dark:text-white mb-3">
            Metadata
          </h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Created</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(node.metadata.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
              <span className="text-gray-900 dark:text-white">
                {node.metadata.lastUpdated}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Tags</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {node.metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}