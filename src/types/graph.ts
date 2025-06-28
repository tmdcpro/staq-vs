export interface GraphNode {
  id: string;
  type: 'experiment' | 'task' | 'milestone' | 'decision' | 'merge';
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed' | 'blocked';
  position: { x: number; y: number };
  data: {
    // Experiment-specific data
    experiment?: {
      approach: string;
      progress: number;
      testCoverage: number;
      qualityScore: number;
      velocity: number;
      risk: 'low' | 'medium' | 'high';
      team: string;
      estimatedCompletion: string;
    };
    // Task-specific data
    task?: {
      description: string;
      assignee: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      estimatedHours: number;
      actualHours?: number;
      blockers?: string[];
    };
    // Milestone data
    milestone?: {
      deliverable: string;
      acceptanceCriteria: string[];
      stakeholders: string[];
      reviewDate: string;
    };
  };
  metadata: {
    createdAt: string;
    lastUpdated: string;
    tags: string[];
    notes?: string;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'dependency' | 'parallel' | 'conditional' | 'merge';
  label?: string;
  data: {
    condition?: string;
    weight?: number;
    blockerType?: 'hard' | 'soft';
    estimatedTransitionTime?: number;
  };
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    projectId: string;
    version: string;
    lastModified: string;
    layout: 'hierarchical' | 'force' | 'circular' | 'dagre';
  };
}

export interface GraphViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface GraphInteractionEvent {
  type: 'node-click' | 'node-hover' | 'edge-click' | 'canvas-click' | 'selection-change';
  nodeId?: string;
  edgeId?: string;
  data?: any;
  position?: { x: number; y: number };
}