import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Activity, TrendingUp, Clock } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface ProjectOverviewProps {
  totalExperiments: number;
  activeExperiments: number;
  completedExperiments: number;
  averageVelocity: number;
  overallProgress: number;
}

export function ProjectOverview({
  totalExperiments,
  activeExperiments,
  completedExperiments,
  averageVelocity,
  overallProgress
}: ProjectOverviewProps) {
  return (
    <div className="bg-white dark:bg-card-dark rounded-lg shadow-card dark:shadow-none p-6 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent-purple/20">
          <Activity className="h-6 w-6 text-accent-purple" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Project Overview
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dev Workflow Orchestrator Development
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-4 rounded-lg bg-gradient-to-br from-primary-light/20 to-primary-DEFAULT/20"
        >
          <GitBranch className="h-8 w-8 text-primary-DEFAULT mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            <AnimatedNumber value={totalExperiments} precision={0} />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Experiments</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center p-4 rounded-lg bg-gradient-to-br from-success-light/20 to-success-DEFAULT/20"
        >
          <Activity className="h-8 w-8 text-success-DEFAULT mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            <AnimatedNumber value={activeExperiments} precision={0} />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center p-4 rounded-lg bg-gradient-to-br from-warning-light/20 to-warning-DEFAULT/20"
        >
          <TrendingUp className="h-8 w-8 text-warning-DEFAULT mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            <AnimatedNumber value={averageVelocity} precision={1} />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Velocity</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center p-4 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-pink/20"
        >
          <Clock className="h-8 w-8 text-accent-purple mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            <AnimatedNumber value={overallProgress} precision={1} />%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
        </motion.div>
      </div>
    </div>
  );
}