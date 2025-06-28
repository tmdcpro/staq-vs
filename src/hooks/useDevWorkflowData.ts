import { useState, useEffect } from 'react';

export interface ExperimentPath {
  id: string;
  name: string;
  approach: string;
  status: 'active' | 'completed' | 'paused' | 'failed';
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  testCoverage: number;
  qualityScore: number;
  velocity: number; // tasks per day
  estimatedCompletion: string;
  risk: 'low' | 'medium' | 'high';
  team: string;
  branch: string;
  lastUpdate: string;
}

export interface DevWorkflowData {
  experiments: {
    [key: string]: ExperimentPath;
  };
  projectOverview: {
    totalExperiments: number;
    activeExperiments: number;
    completedExperiments: number;
    averageVelocity: number;
    overallProgress: number;
  };
  dailyVelocity: { day: string; velocity: number; experiments: number }[];
  qualityTrend: { day: string; coverage: number; score: number }[];
  resourceAllocation: { team: string; experiments: number; utilization: number }[];
  recentEvents: {
    timestamp: string;
    type: 'milestone' | 'merge' | 'test_failure' | 'experiment_start' | 'experiment_complete';
    experiment: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

const initialData: DevWorkflowData = {
  experiments: {
    'exp-001': {
      id: 'exp-001',
      name: 'React Component Approach',
      approach: 'Component-based architecture with hooks',
      status: 'active',
      progress: 75,
      tasksCompleted: 15,
      totalTasks: 20,
      testCoverage: 92,
      qualityScore: 88,
      velocity: 2.3,
      estimatedCompletion: '2024-01-15',
      risk: 'low',
      team: 'Frontend Team A',
      branch: 'feature/react-components',
      lastUpdate: '2 hours ago'
    },
    'exp-002': {
      id: 'exp-002',
      name: 'Micro-service Approach',
      approach: 'Distributed services with GraphQL',
      status: 'active',
      progress: 60,
      tasksCompleted: 12,
      totalTasks: 20,
      testCoverage: 85,
      qualityScore: 82,
      velocity: 1.8,
      estimatedCompletion: '2024-01-18',
      risk: 'medium',
      team: 'Backend Team B',
      branch: 'feature/microservices',
      lastUpdate: '4 hours ago'
    },
    'exp-003': {
      id: 'exp-003',
      name: 'Monolithic Approach',
      approach: 'Traditional MVC with enhanced performance',
      status: 'active',
      progress: 45,
      tasksCompleted: 9,
      totalTasks: 20,
      testCoverage: 78,
      qualityScore: 79,
      velocity: 1.5,
      estimatedCompletion: '2024-01-22',
      risk: 'high',
      team: 'Full-stack Team C',
      branch: 'feature/monolithic',
      lastUpdate: '1 hour ago'
    }
  },
  projectOverview: {
    totalExperiments: 3,
    activeExperiments: 3,
    completedExperiments: 0,
    averageVelocity: 1.87,
    overallProgress: 60
  },
  dailyVelocity: [
    { day: 'Mon', velocity: 1.8, experiments: 3 },
    { day: 'Tue', velocity: 2.1, experiments: 3 },
    { day: 'Wed', velocity: 1.9, experiments: 3 },
    { day: 'Thu', velocity: 2.3, experiments: 3 },
    { day: 'Fri', velocity: 1.7, experiments: 3 },
    { day: 'Sat', velocity: 0.8, experiments: 2 },
    { day: 'Sun', velocity: 0.5, experiments: 1 }
  ],
  qualityTrend: Array.from({ length: 8 }, (_, i) => ({
    day: (i + 1).toString(),
    coverage: 75 + Math.random() * 20,
    score: 70 + Math.random() * 25
  })),
  resourceAllocation: [
    { team: 'Frontend Team A', experiments: 1, utilization: 85 },
    { team: 'Backend Team B', experiments: 1, utilization: 78 },
    { team: 'Full-stack Team C', experiments: 1, utilization: 92 }
  ],
  recentEvents: [
    {
      timestamp: '2024-01-10 14:30',
      type: 'milestone',
      experiment: 'exp-001',
      description: 'Component library milestone reached',
      priority: 'high'
    },
    {
      timestamp: '2024-01-10 11:15',
      type: 'test_failure',
      experiment: 'exp-002',
      description: 'Integration tests failing on GraphQL endpoint',
      priority: 'medium'
    },
    {
      timestamp: '2024-01-10 09:45',
      type: 'merge',
      experiment: 'exp-003',
      description: 'Feature branch merged to develop',
      priority: 'low'
    }
  ]
};

function simulateDataChange(currentData: DevWorkflowData): DevWorkflowData {
  const updatedExperiments = Object.entries(currentData.experiments).reduce((acc, [key, exp]) => {
    const progressChange = (Math.random() - 0.4) * 3; // Slight upward bias
    const newProgress = Math.min(100, Math.max(0, exp.progress + progressChange));
    
    return {
      ...acc,
      [key]: {
        ...exp,
        progress: +newProgress.toFixed(1),
        testCoverage: Math.min(100, Math.max(0, exp.testCoverage + (Math.random() - 0.5) * 2)),
        qualityScore: Math.min(100, Math.max(0, exp.qualityScore + (Math.random() - 0.5) * 3)),
        velocity: Math.max(0, exp.velocity + (Math.random() - 0.5) * 0.3),
        tasksCompleted: newProgress > exp.progress ? exp.tasksCompleted + Math.floor(Math.random() * 2) : exp.tasksCompleted
      }
    };
  }, {});

  return {
    ...currentData,
    experiments: updatedExperiments,
    projectOverview: {
      ...currentData.projectOverview,
      overallProgress: Object.values(updatedExperiments).reduce((sum, exp) => sum + exp.progress, 0) / Object.keys(updatedExperiments).length,
      averageVelocity: Object.values(updatedExperiments).reduce((sum, exp) => sum + exp.velocity, 0) / Object.keys(updatedExperiments).length
    },
    dailyVelocity: currentData.dailyVelocity.map(item => ({
      ...item,
      velocity: Math.max(0, item.velocity + (Math.random() - 0.5) * 0.5)
    })),
    qualityTrend: [...currentData.qualityTrend.slice(1), {
      day: (+currentData.qualityTrend[currentData.qualityTrend.length - 1].day + 1).toString(),
      coverage: 75 + Math.random() * 20,
      score: 70 + Math.random() * 25
    }]
  };
}

export function useDevWorkflowData() {
  const [data, setData] = useState<DevWorkflowData>(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(current => simulateDataChange(current));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return data;
}