import React, { useState } from 'react';
import { Check, Clock, AlertCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '../hooks/useDevWorkflowData';
import { useDevWorkflowData } from '../hooks/useDevWorkflowData';

interface TaskListProps {
  experimentId?: string;
  className?: string;
}

export function TaskList({ experimentId, className = '' }: TaskListProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const data = useDevWorkflowData();
  
  // Get tasks from all experiments, or filter by experimentId if provided
  const allTasks: Task[] = Object.values(data.experiments)
    .flatMap(exp => exp.tasks || [])
    .filter(task => !experimentId || task.experimentId === experimentId);
  
  const pendingTasks = allTasks.filter(task => task.status === 'pending');
  const activeTasks = allTasks.filter(task => task.status === 'active');
  const completedTasks = allTasks.filter(task => task.status === 'completed');
  const blockedTasks = allTasks.filter(task => task.status === 'blocked');
  
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-success-DEFAULT" />;
      case 'active':
        return <Clock className="h-4 w-4 text-primary-DEFAULT" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-warning-DEFAULT" />;
      default:
        return <ArrowRight className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">Critical</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400">Low</span>;
    }
  };
  
  const toggleTask = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };
  
  const TaskSection = ({ title, tasks, icon }: { title: string; tasks: Task[]; icon: React.ReactNode }) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title} ({tasks.length})</h3>
      </div>
      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              isExpanded={expandedTask === task.id}
              onToggle={() => toggleTask(task.id)}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">No tasks</div>
        )}
      </div>
    </div>
  );
  
  const TaskItem = ({ task, isExpanded, onToggle }: { task: Task; isExpanded: boolean; onToggle: () => void }) => {
    const experimentName = data.experiments[task.experimentId]?.name || 'Unknown Experiment';
    
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200"
      >
        <div 
          className="p-3 cursor-pointer flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750"
          onClick={onToggle}
        >
          <div className="flex items-center gap-2 min-w-0">
            {getStatusIcon(task.status)}
            <div className="min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                {task.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {experimentName} • {task.assignee || 'Unassigned'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getPriorityBadge(task.priority)}
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-2"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {task.description}
            </p>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated:</span>
                <span className="font-medium">{task.estimatedHours}h</span>
              </div>
              {task.actualHours !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Actual:</span>
                  <span className="font-medium">{task.actualHours}h</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Progress:</span>
                <span className="font-medium">{task.progress}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due:</span>
                <span className="font-medium">{task.dueDate || 'Not set'}</span>
              </div>
            </div>
            
            {task.status === 'blocked' && (
              <div className="mt-2 p-2 bg-warning-light/10 dark:bg-warning-dark/10 rounded text-xs text-warning-dark dark:text-warning-light">
                <strong>Blocked:</strong> Waiting for dependent tasks to complete.
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Tasks {experimentId ? `for ${data.experiments[experimentId]?.name || ''}` : 'Overview'}
      </h2>
      
      {activeTasks.length > 0 && (
        <TaskSection 
          title="In Progress" 
          tasks={activeTasks} 
          icon={<Clock className="h-4 w-4 text-primary-DEFAULT" />} 
        />
      )}
      
      {blockedTasks.length > 0 && (
        <TaskSection 
          title="Blocked" 
          tasks={blockedTasks} 
          icon={<AlertCircle className="h-4 w-4 text-warning-DEFAULT" />} 
        />
      )}
      
      {pendingTasks.length > 0 && (
        <TaskSection 
          title="To Do" 
          tasks={pendingTasks} 
          icon={<ArrowRight className="h-4 w-4 text-gray-500" />} 
        />
      )}
      
      {completedTasks.length > 0 && (
        <TaskSection 
          title="Completed" 
          tasks={completedTasks.slice(0, 5)} // Show only the 5 most recent completed tasks
          icon={<Check className="h-4 w-4 text-success-DEFAULT" />} 
        />
      )}
      
      {completedTasks.length > 5 && (
        <button className="text-xs text-primary-DEFAULT hover:text-primary-dark">
          View all {completedTasks.length} completed tasks
        </button>
      )}
    </div>
  );
}