import React, { useRef, useEffect, useState } from 'react';
import { GraphData, GraphInteractionEvent, GraphViewport } from '../types/graph';

interface GraphRendererProps {
  graphData: GraphData;
  viewport: GraphViewport;
  onViewportChange: (viewport: GraphViewport) => void;
  onInteraction: (event: GraphInteractionEvent) => void;
  className?: string;
}

export function GraphRenderer({
  graphData,
  viewport,
  onViewportChange,
  onInteraction,
  className = ''
}: GraphRendererProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - viewport.x, y: event.clientY - viewport.y });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    
    onViewportChange({
      ...viewport,
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, viewport.zoom * delta));
    
    onViewportChange({
      ...viewport,
      zoom: newZoom
    });
  };

  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onInteraction({
      type: 'node-click',
      nodeId,
      position: { x: event.clientX, y: event.clientY }
    });
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (event.target === svgRef.current) {
      onInteraction({
        type: 'canvas-click',
        position: { x: event.clientX, y: event.clientY }
      });
    }
  };

  const getNodeColor = (status: string, type: string) => {
    const baseColors = {
      experiment: '#3B82F6',
      task: '#10B981',
      milestone: '#F59E0B',
      decision: '#8B5CF6',
      merge: '#EF4444'
    };

    const statusModifiers = {
      pending: 0.6,
      active: 1,
      completed: 0.8,
      failed: 0.4,
      blocked: 0.3
    };

    const baseColor = baseColors[type as keyof typeof baseColors] || '#6B7280';
    const opacity = statusModifiers[status as keyof typeof statusModifiers] || 0.8;
    
    return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  const renderNode = (node: any) => {
    const radius = node.type === 'experiment' ? 30 : 20;
    const color = getNodeColor(node.status, node.type);
    
    return (
      <g key={node.id} transform={`translate(${node.position.x}, ${node.position.y})`}>
        <circle
          r={radius}
          fill={color}
          stroke="white"
          strokeWidth="2"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => handleNodeClick(node.id, e)}
        />
        <text
          textAnchor="middle"
          dy="0.3em"
          fontSize="12"
          fill="white"
          className="pointer-events-none font-medium"
        >
          {node.type === 'experiment' ? 'EXP' : 
           node.type === 'task' ? 'T' : 
           node.type === 'milestone' ? 'M' : 'D'}
        </text>
        <text
          textAnchor="middle"
          dy={radius + 15}
          fontSize="10"
          fill="currentColor"
          className="pointer-events-none"
        >
          {node.label.length > 15 ? `${node.label.substring(0, 15)}...` : node.label}
        </text>
      </g>
    );
  };

  const renderEdge = (edge: any) => {
    const sourceNode = graphData.nodes.find(n => n.id === edge.source);
    const targetNode = graphData.nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return null;

    const strokeColor = {
      dependency: '#6B7280',
      parallel: '#3B82F6',
      conditional: '#F59E0B',
      merge: '#EF4444'
    }[edge.type] || '#6B7280';

    return (
      <line
        key={edge.id}
        x1={sourceNode.position.x}
        y1={sourceNode.position.y}
        x2={targetNode.position.x}
        y2={targetNode.position.y}
        stroke={strokeColor}
        strokeWidth="2"
        strokeDasharray={edge.type === 'conditional' ? '5,5' : 'none'}
        className="opacity-60"
      />
    );
  };

  return (
    <div className={`relative overflow-hidden bg-gray-50 dark:bg-gray-900 ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
      >
        <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
          {/* Render edges first */}
          {graphData.edges.map(renderEdge)}
          
          {/* Render nodes on top */}
          {graphData.nodes.map(renderNode)}
        </g>
      </svg>
      
      {/* Viewport Info */}
      <div className="absolute top-2 left-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
        Zoom: {(viewport.zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
}