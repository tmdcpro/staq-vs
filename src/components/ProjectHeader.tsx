import React, { useState } from 'react';
import { File, ExternalLink, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDevWorkflowData } from '../hooks/useDevWorkflowData';

interface ProjectHeaderProps {
  onViewPRD: () => void;
  onSelectPRD: () => void;
}

export function ProjectHeader({ onViewPRD, onSelectPRD }: ProjectHeaderProps) {
  const workflowData = useDevWorkflowData();
  const [showDetails, setShowDetails] = useState(false);
  
  const hasPRD = workflowData.projectOverview.prdPath !== undefined;
  
  return (
    <div className="bg-white dark:bg-card-dark shadow-md rounded-lg p-4 mb-6 transition-all">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center gap-3 mb-3 md:mb-0">
          <div className="p-2 rounded-lg bg-accent-purple/20">
            <FileText className="h-6 w-6 text-accent-purple" />
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {workflowData.projectOverview.projectName}
            </h2>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              {hasPRD ? (
                <>
                  <File className="h-4 w-4 mr-1" />
                  <span className="truncate max-w-[250px]">{workflowData.projectOverview.prdPath || 'PROJECT_REQUIREMENTS.md'}</span>
                  <button 
                    onClick={onViewPRD}
                    className="ml-2 text-primary-DEFAULT hover:text-primary-dark flex items-center"
                  >
                    View <ExternalLink className="h-3 w-3 ml-1" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={onSelectPRD}
                  className="text-warning-DEFAULT hover:text-warning-dark flex items-center"
                >
                  No PRD selected • Click to select or import one <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex flex-col w-full md:w-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Progress</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{workflowData.projectOverview.overallProgress}%</span>
            </div>
            <div className="w-full md:w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${workflowData.projectOverview.overallProgress}%` }}
                className={`h-full rounded-full ${
                  workflowData.projectOverview.overallProgress < 30 
                    ? 'bg-warning-DEFAULT' 
                    : workflowData.projectOverview.overallProgress < 70 
                      ? 'bg-primary-DEFAULT' 
                      : 'bg-success-DEFAULT'
                }`}
              />
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-primary-DEFAULT hover:underline text-sm"
          >
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
        </div>
      </div>
      
      {showDetails && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Current Phase</h3>
              <div className="p-3 bg-primary-light/10 dark:bg-primary-dark/20 rounded-lg">
                <span className="text-primary-DEFAULT font-medium">{workflowData.projectOverview.currentPhase}</span>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {workflowData.projectOverview.phaseDescription || 'Implementing core functionalities and establishing the foundation.'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Next Milestone</h3>
              <div className="p-3 bg-warning-light/10 dark:bg-warning-dark/20 rounded-lg">
                <span className="text-warning-DEFAULT font-medium">{workflowData.projectOverview.nextMilestone || 'Feature Complete'}</span>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {workflowData.projectOverview.milestoneDescription || 'Expected completion in 5 days based on current velocity.'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Status Overview</h3>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between text-xs">
                  <span>Tasks completed:</span>
                  <span className="font-medium">{Object.values(workflowData.experiments).reduce((total, exp) => total + exp.tasksCompleted, 0)} / {Object.values(workflowData.experiments).reduce((total, exp) => total + exp.totalTasks, 0)}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Active experiments:</span>
                  <span className="font-medium">{workflowData.projectOverview.activeExperiments}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Avg. velocity:</span>
                  <span className="font-medium">{workflowData.projectOverview.averageVelocity.toFixed(1)}/day</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}