import { ExperimentPath, Task } from '../hooks/useDevWorkflowData';
import { GraphNode, GraphEdge, GraphData } from '../types/graph';

export function transformExperimentsToGraph(
  experiments: Record<string, ExperimentPath>,
  dependencies: Array<{ source: string; target: string; type: string }> = []
): GraphData {
  // Begin by extracting all tasks across all experiments
  const allTasks: Task[] = Object.values(experiments).flatMap(exp => exp.tasks || []);
  
  const nodes: GraphNode[] = Object.values(experiments).map((exp, index) => ({
    id: exp.id,
    type: 'experiment',
    label: exp.name,
    status: exp.status === 'active' ? 'active' : 
            exp.status === 'completed' ? 'completed' : 
            exp.status === 'failed' ? 'failed' : 'pending',
    position: calculateNodePosition(index, Object.keys(experiments).length),
    data: {
      experiment: {
        approach: exp.approach,
        progress: exp.progress,
        testCoverage: exp.testCoverage,
        qualityScore: exp.qualityScore,
        velocity: exp.velocity,
        risk: exp.risk,
        team: exp.team,
        estimatedCompletion: exp.estimatedCompletion
      }
    },
    metadata: {
      createdAt: new Date().toISOString(),
      lastUpdated: exp.lastUpdate,
      tags: [exp.team, exp.risk, exp.status],
      notes: `Branch: ${exp.branch}`
    }
  }));

  // Add milestone nodes based on experiments' progress
  const milestoneNodes: GraphNode[] = Object.values(experiments).map((exp, index) => {
    const completionPercentage = exp.progress;
    const milestoneStatus = completionPercentage >= 100 ? 'completed' : 
                            completionPercentage > 0 ? 'active' : 'pending';
    
    return {
      id: `milestone-${exp.id}`,
      type: 'milestone',
      label: `${exp.name} Completion`,
      status: milestoneStatus,
      position: calculateMilestonePosition(index, Object.keys(experiments).length),
      data: {
        milestone: {
          deliverable: `Complete ${exp.name} approach`,
          acceptanceCriteria: [
            'All tasks completed',
            `Test coverage >= ${exp.testCoverage}%`,
            `Quality score >= ${exp.qualityScore}`
          ],
          stakeholders: [exp.team],
          reviewDate: exp.estimatedCompletion
        }
      },
      metadata: {
        createdAt: new Date().toISOString(),
        lastUpdated: exp.lastUpdate,
        tags: [exp.team, exp.risk, exp.status, 'milestone'],
        notes: `Final milestone for the ${exp.name} experiment`
      }
    };
  });

  // Add task nodes for each experiment
  const taskNodes: GraphNode[] = [];
  Object.values(experiments).forEach((exp, expIndex) => {
    for (let i = 0; i < exp.totalTasks; i++) {
      const taskId = `${exp.id}-task-${i}`;
      const isCompleted = i < exp.tasksCompleted;
      
      taskNodes.push({
        id: taskId,
        type: 'task',
        label: `Task ${i + 1}`,
        status: isCompleted ? 'completed' : 'pending',
        position: calculateTaskPosition(expIndex, i, exp.totalTasks),
        data: {
          task: {
            description: `Task ${i + 1} for ${exp.name}`,
            assignee: exp.team,
            priority: i < 3 ? 'high' : i < 6 ? 'medium' : 'low',
            estimatedHours: 8,
            actualHours: isCompleted ? 6 + Math.random() * 4 : undefined
          }
        },
        metadata: {
          createdAt: new Date().toISOString(),
          lastUpdated: exp.lastUpdate,
          tags: [exp.team, 'task'],
          notes: `Part of ${exp.name} experiment`
        }
      });
    }
  });

  // Add PRD item nodes - In a real implementation, these would come from parsing the actual PRD
  const prdNodes: GraphNode[] = [
    {
      id: 'prd-f1.1',
      type: 'task',
      label: 'F1.1: PRD Import',
      status: 'completed',
      position: { x: 200, y: 50 },
      data: {
        task: {
          description: 'Support import of PRD documents (Markdown, PDF, JSON)',
          assignee: 'Data Team',
          priority: 'high',
          estimatedHours: 16
        }
      },
      metadata: {
        createdAt: new Date().toISOString(),
        lastUpdated: '1 day ago',
        tags: ['PRD', 'import', 'completed'],
      }
    },
    // Additional PRD item nodes would be created here
  ];

  // Combine all nodes
  const allNodes = [
    ...nodes,
    ...taskNodes,
    ...milestoneNodes,
    ...prdNodes
  ];

  // Create additional edges to connect PRD items to tasks
  const prdToTaskEdges: GraphEdge[] = [];
  // Logic to connect PRD items to tasks would go here

  const edges: GraphEdge[] = [
    ...dependencies.map(dep => ({
      id: `${dep.source}-${dep.target}`,
      source: dep.source,
      target: dep.target,
      type: dep.type as any,
      data: {
        weight: 1,
        blockerType: 'soft' as const
      }
    })),
    // Add edges from experiments to their tasks
    ...taskNodes.map(task => ({
      id: `${task.id.split('-task-')[0]}-to-${task.id}`,
      source: task.id.split('-task-')[0],
      target: task.id,
      type: 'dependency' as const,
      data: {
        weight: 1,
        blockerType: 'hard' as const
      }
    })),
    
    // Connect experiments to their milestones
    ...Object.values(experiments).map(exp => ({
      id: `${exp.id}-to-milestone-${exp.id}`,
      source: exp.id,
      target: `milestone-${exp.id}`,
      type: 'dependency' as const,
      data: {
        weight: 1,
        blockerType: 'soft' as const
      }
    }))
  ];

  return {
    nodes: [...nodes, ...taskNodes],
    edges,
    metadata: {
      projectId: 'dwo-main',
      version: '1.0.0',
      lastModified: new Date().toISOString(),
      layout: 'hierarchical'
    }
  };
}

function calculateNodePosition(index: number, total: number): { x: number; y: number } {
  const centerX = 400;
  const centerY = 200;
  const radius = 150;
  const angle = (index / total) * 2 * Math.PI;
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  };
}

function calculateMilestonePosition(index: number, total: number): { x: number; y: number } {
  const baseX = 600;
  const baseY = 150 + (index * 100);
  
  return {
    x: baseX,
    y: baseY
  };
}

function calculateTaskPosition(expIndex: number, taskIndex: number, totalTasks: number): { x: number; y: number } {
  const baseX = 100 + expIndex * 300;
  const baseY = 300 + (taskIndex / totalTasks) * 200;
  
  return {
    x: baseX,
    y: baseY
  };
}

function calculateTaskPosition(expIndex: number, taskIndex: number, totalTasks: number): { x: number; y: number } {
  const baseX = 100 + expIndex * 300;
  const baseY = 300 + (taskIndex / totalTasks) * 200;
  
  return {
    x: baseX,
    y: baseY
  };
}

export function generateExperimentDependencies(experiments: Record<string, ExperimentPath>) {
  const deps = [];
  const expKeys = Object.keys(experiments);
  
  // Create some logical dependencies
  for (let i = 1; i < expKeys.length; i++) {
    deps.push({
      source: expKeys[i - 1],
      target: expKeys[i],
      type: 'parallel'
    });
  }
  
  return deps;
}

export function calculateGraphMetrics(graphData: GraphData) {
  const nodesByStatus = graphData.nodes.reduce((acc, node) => {
    acc[node.status] = (acc[node.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const edgesByType = graphData.edges.reduce((acc, edge) => {
    acc[edge.type] = (acc[edge.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completionRate = (nodesByStatus.completed || 0) / graphData.nodes.length;
  const criticalPath = findCriticalPath(graphData);

  return {
    totalNodes: graphData.nodes.length,
    totalEdges: graphData.edges.length,
    nodesByStatus,
    edgesByType,
    completionRate,
    criticalPathLength: criticalPath.length,
    estimatedCompletion: calculateEstimatedCompletion(graphData)
  };
}

function findCriticalPath(graphData: GraphData): string[] {
  // Simplified critical path calculation
  // In a real implementation, this would use proper graph algorithms
  const experimentNodes = graphData.nodes.filter(n => n.type === 'experiment');
  return experimentNodes.map(n => n.id);
}

function calculateEstimatedCompletion(graphData: GraphData): string {
  const experimentNodes = graphData.nodes.filter(n => n.type === 'experiment');
  const avgProgress = experimentNodes.reduce((sum, node) => 
    sum + (node.data.experiment?.progress || 0), 0
  ) / experimentNodes.length;

  const remainingDays = Math.ceil((100 - avgProgress) / 10); // Simplified calculation
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + remainingDays);
  
  return futureDate.toISOString().split('T')[0];
}