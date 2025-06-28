import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Grid, Network, CircleDot } from 'lucide-react';

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onLayoutChange: (layout: 'hierarchical' | 'force' | 'circular') => void;
  currentLayout: string;
  zoom: number;
}

export function GraphControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onLayoutChange,
  currentLayout,
  zoom
}: GraphControlsProps) {
  const layoutOptions = [
    { value: 'hierarchical', icon: Grid, label: 'Hierarchical' },
    { value: 'force', icon: Network, label: 'Force-directed' },
    { value: 'circular', icon: CircleDot, label: 'Circular' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 space-y-2">
      {/* Zoom Controls */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onZoomIn}
          disabled={zoom >= 3}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>
        
        <button
          onClick={onZoomOut}
          disabled={zoom <= 0.1}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>
        
        <button
          onClick={onResetView}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
          Layout
        </div>
        {layoutOptions.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => onLayoutChange(value as any)}
            className={`w-full p-2 rounded-md flex items-center gap-2 text-xs transition-colors ${
              currentLayout === value
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}
            title={label}
          >
            <Icon className="h-3 w-3" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}