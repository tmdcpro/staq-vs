import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { motion } from 'framer-motion';
import { GitBranch, Users, TestTube, Clock, AlertTriangle, CheckCircle2, Play, Pause } from 'lucide-react';
import 'react-circular-progressbar/dist/styles.css';
import { AnimatedNumber } from './AnimatedNumber';
import { StatusBadge } from './StatusBadge';
import { ExperimentPath as ExperimentPathType } from '../hooks/useDevWorkflowData';

interface ExperimentPathProps extends ExperimentPathType {
  color: 'primary' | 'warning' | 'success';
  onTogglePause?: (experimentId: string) => void;
}

const colorMap = {
  primary: {
    border: 'border-primary-DEFAULT',
    path: '#2563EB',
    pathDark: '#60A5FA',
    gradient: 'from-primary-light/20 to-primary-DEFAULT/20',
    iconBg: 'bg-primary-light/20'
  },
  warning: {
    border: 'border-warning-DEFAULT',
    path: '#D97706',
    pathDark: '#FBBF24',
    gradient: 'from-warning-light/20 to-warning-DEFAULT/20',
    iconBg: 'bg-warning-light/20'
  },
  success: {
    border: 'border-success-DEFAULT',
    path: '#059669',
    pathDark: '#34D399',
    gradient: 'from-success-light/20 to-success-DEFAULT/20',
    iconBg: 'bg-success-light/20'
  }
};

const riskColorMap = {
  low: 'text-success-DEFAULT bg-success-DEFAULT/10',
  medium: 'text-warning-DEFAULT bg-warning-DEFAULT/10',
  high: 'text-red-500 bg-red-500/10'
};

export function ExperimentPath({
  id,
  name,
  approach,
  status,
  progress,
  tasksCompleted,
  totalTasks,
  testCoverage,
  qualityScore,
  velocity,
  estimatedCompletion,
  risk,
  team,
  branch,
  lastUpdate,
  color,
  onTogglePause
}: ExperimentPathProps) {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-card-dark bg-gradient-to-br ${colorMap[color].gradient} backdrop-blur-sm rounded-lg shadow-card dark:shadow-none p-6 relative overflow-hidden transition-all duration-200`}
    >
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${colorMap[color].iconBg}`}>
              <GitBranch className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {approach}
              </p>
              <StatusBadge status={status === 'failed' ? 'error' : status === 'paused' ? 'warning' : 'operational'} />
            </div>
          </div>
          
          {/* Progress Circle */}
          <div className="w-20 h-20">
            <CircularProgressbar
              value={progress}
              text={`${progress.toFixed(1)}%`}
              styles={buildStyles({
                pathColor: isDark ? colorMap[color].pathDark : colorMap[color].path,
                textColor: isDark ? '#FFFFFF' : '#1F2937',
                trailColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                pathTransition: 'stroke-dashoffset 0.5s ease 0s',
                textSize: '14px'
              })}
            />
          </div>
        </div>

        {/* Risk and Controls */}
        <div className="flex justify-between items-center">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${riskColorMap[risk]}`}>
            {risk.toUpperCase()} RISK
          </div>
          <button
            onClick={() => onTogglePause?.(id)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            {status === 'paused' ? (
              <Play className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Pause className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <TestTube className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Tasks</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              <AnimatedNumber value={tasksCompleted} precision={0} />
              <span className="text-sm font-normal text-gray-500">/{totalTasks}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Velocity</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              <AnimatedNumber value={velocity} precision={1} />
              <span className="text-sm font-normal text-gray-500">/day</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Coverage</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              <AnimatedNumber value={testCoverage} precision={1} />%
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Quality</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              <AnimatedNumber value={qualityScore} precision={1} />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{team}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <GitBranch className="h-4 w-4" />
              <span className="font-mono text-xs">{branch}</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>ETA: {estimatedCompletion}</span>
            <span>Updated: {lastUpdate}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}