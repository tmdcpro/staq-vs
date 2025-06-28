import React, { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Network, ZoomIn, ZoomOut, RotateCcw, Settings, GitBranch } from 'lucide-react';
import { GraphData, GraphInteractionEvent, GraphViewport } from '../types/graph';
import { transformExperimentsToGraph, generateExperimentDependencies, calculateGraphMetrics } from '../utils/graphTransforms';
import { useDevWorkflowData } from '../hooks/useDevWorkflowData';
import { GraphRenderer } from './GraphRenderer';
import { GraphControls } from './GraphControls';
import { GraphMetrics } from './GraphMetrics';
import { NodeDetailsPanel } from './NodeDetailsPanel';

interface DAGVisualizationProps {
  className?: string;
  onNodeInteraction?: (event: GraphInteractionEvent) => void;
}

export function DAGVisualization({ className = '', onNodeInteraction }: DAGVisualizationProps) {
  const workflowData = useDevWorkflowData();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<GraphViewport>({ x: 0, y: 0, zoom: 1 });
  const [showMetrics, setShowMetrics] = useState(true);
  const [layoutType, setLayoutType] = useState<'hierarchical' | 'force' | 'circular'>('hierarchical');

  const graphData = useMemo(() => {
    const dependencies = generateExperimentDependencies(workflowData.experiments);
    const graph = transformExperimentsToGraph(workflowData.experiments, dependencies);
    return { ...graph, metadata: { ...graph.metadata, layout: layoutType } };
  }, [workflowData.experiments, layoutType]);

  const graphMetrics = useMemo(() => calculateGraphMetrics(graphData), [graphData]);

  const handleNodeInteraction = useCallback((event: GraphInteractionEvent) => {
    if (event.type === 'node-click' && event.nodeId) {
      setSelectedNodeId(event.nodeId);
    }
    onNodeInteraction?.(event);
  }, [onNodeInteraction]);

  const handleZoomIn = () => {
    setViewport(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 3) }));
  };

  const handleZoomOut = () => {
    setViewport(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.1) }));
  };

  const handleResetView = () => {
    setViewport({ x: 0, y: 0, zoom: 1 });
  };

  const selectedNode = selectedNodeId ? 
    graphData.nodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className={`bg-white dark:bg-card-dark rounded-lg shadow-card dark:shadow-none transition-colors duration-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-purple/20">
              <Network className="h-6 w-6 text-accent-purple" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Development Workflow DAG
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interactive visualization of parallel development paths
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Main Graph Area */}
        <div className="flex-1 relative">
          <GraphRenderer
            graphData={graphData}
            viewport={viewport}
            onViewportChange={setViewport}
            onInteraction={handleNodeInteraction}
            className="w-full h-full"
          />
          
          {/* Graph Controls */}
          <div className="absolute top-4 right-4">
            <GraphControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetView={handleResetView}
              onLayoutChange={setLayoutType}
              currentLayout={layoutType}
              zoom={viewport.zoom}
            />
          </div>

          {/* Metrics Overlay */}
          {showMetrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4"
            >
              <GraphMetrics metrics={graphMetrics} />
            </motion.div>
          )}
        </div>

        {/* Node Details Panel */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-80 border-l border-gray-200 dark:border-gray-700"
          >
            <NodeDetailsPanel
              node={selectedNode}
              onClose={() => setSelectedNodeId(null)}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}