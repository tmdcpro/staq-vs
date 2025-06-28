import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Workflow, Code, GitBranch, Zap, Play, CheckCircle, Database, Upload, Plus } from 'lucide-react';
import { transformToSimStudioWorkflow, transformFromSimStudioWorkflow } from '../utils/simStudioTransforms';
import { useDevWorkflowData } from '../hooks/useDevWorkflowData';

// This is a placeholder for SimStudio integration
// Will be replaced with actual SimStudio components once we have the SDK

interface SimStudioIntegrationProps {
  onWorkflowChange?: (workflow: any) => void;
  initialWorkflow?: any;
}

export function SimStudioIntegration({
  onWorkflowChange,
  initialWorkflow
}: SimStudioIntegrationProps) {
  const [isSimStudioLoaded, setIsSimStudioLoaded] = useState(false);
  const [simulationMode, setSimulationMode] = useState(true);
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [showWorkflowVisualization, setShowWorkflowVisualization] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<'connecting' | 'ready' | 'running' | 'completed'>('connecting');
  const workflowData = useDevWorkflowData();

  useEffect(() => {
    // This will be replaced with actual SimStudio SDK loading
    const loadSimStudio = async () => {
      try {
        // Simulated loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real implementation:
        // const SimStudio = await import('@simstudio/react');
        // setIsSimStudioLoaded(true);
        
        setTimeout(() => {
          setIsSimStudioLoaded(true);
          setIntegrationStatus('ready');
        }, 1000);
      } catch (error) {
        console.error('Failed to load SimStudio:', error);
      }
    };

    loadSimStudio();
  }, []);

  useEffect(() => {
    // When we have initial workflow data, transform it to SimStudio format
    if (initialWorkflow && isSimStudioLoaded) {
      const simStudioWorkflow = transformToSimStudioWorkflow(workflowData.experiments);
      console.log('Transformed workflow:', simStudioWorkflow);
      
      if (onWorkflowChange) {
        onWorkflowChange(simStudioWorkflow);
      }
    }
  }, [initialWorkflow, isSimStudioLoaded, onWorkflowChange, workflowData.experiments]);
  
  const handleCreateWorkflow = () => {
    setShowCreateModal(true);
  };
  
  const handleImportPRD = () => {
    setShowImportModal(true);
    
    // Simulate import progress
    setImportProgress(0);
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowImportModal(false);
            setActiveExperiment('exp-001'); // Set the first experiment as active after import
            setIntegrationStatus('running');
            
            // Simulate a workflow execution after import
            setTimeout(() => {
              setIntegrationStatus('completed');
              setShowWorkflowVisualization(true);
            }, 3000);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const closeModals = () => {
    setShowCreateModal(false);
    setShowImportModal(false);
  };
  
  const handleExperimentSelect = (experimentId: string) => {
    setActiveExperiment(experimentId);
    setIntegrationStatus('running');
    
    // Simulate a workflow execution
    setTimeout(() => {
      setIntegrationStatus('completed');
      setShowWorkflowVisualization(true);
    }, 3000);
  };
  
  const renderStatusBadge = () => {
    switch (integrationStatus) {
      case 'connecting':
        return (
          <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm font-medium">
            Connecting to SimStudio
          </span>
        );
      case 'ready':
        return (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
            SimStudio Ready
          </span>
        );
      case 'running':
        return (
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium flex items-center gap-1">
            <Play className="h-3 w-3" /> Running Experiment
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Experiment Complete
          </span>
        );
    }
  };

  if (!isSimStudioLoaded) {
    return (
      <div className="bg-white dark:bg-card-dark rounded-lg shadow-card dark:shadow-none p-8">
        <div className="flex items-center justify-center space-y-4 flex-col">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading SimStudio Integration...</p>
        </div>
      </div>
    );
  }

  if (simulationMode) {
    return (
      <div className="bg-white dark:bg-card-dark rounded-lg shadow-card dark:shadow-none transition-colors duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  SimStudio Workflow Editor
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Agentic workflow visualization and management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                SimStudio Ready
              </span>
            </div>
          </div>
        </div>

        {/* Simulated SimStudio Interface */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 min-h-96">
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="space-y-6"
              >
                <div className="flex justify-center space-x-4">
                  {/* Simulated workflow nodes */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg"
                  >
                    <Code className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 bg-green-500 rounded-lg flex items-center justify-center shadow-lg"
                  >
                    <GitBranch className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg"
                  >
                    <Zap className="h-8 w-8 text-white" />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    SimStudio Workflow Integration
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Sim Studio's workflow engine is integrated with the Dev Workflow Orchestrator, enabling automated 
                    orchestration of parallel development experiments. Select an experiment below to run its workflow.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {Object.entries(workflowData.experiments).map(([key, experiment], index) => (
                    <motion.div 
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm cursor-pointer ${activeExperiment === key ? 'ring-2 ring-purple-500' : ''}`}
                      onClick={() => handleExperimentSelect(key)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-lg font-bold text-gray-900 dark:text-white truncate">
                          {experiment.name}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          experiment.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                          experiment.status === 'paused' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        }`}>
                          {experiment.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {experiment.approach}
                      </div>
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Database className="w-3 h-3 mr-1" />
                        <span>{experiment.tasksCompleted}/{experiment.totalTasks} tasks</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {activeExperiment && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 max-w-3xl mx-auto"
                  >
                    <h5 className="font-semibold mb-2 text-gray-900 dark:text-white">Workflow Status</h5>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Current Stage:</span>
                        <div className="flex items-center gap-2">
                          {integrationStatus === 'running' ? (
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"
                              />
                              <span className="text-purple-500">Processing tasks...</span>
                            </div>
                          ) : integrationStatus === 'completed' ? (
                            <span className="text-green-500 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" /> Workflow completed
                            </span>
                          ) : (
                            <span className="text-gray-500">Waiting to start</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Agent Count:</span>
                        <span className="text-gray-800 dark:text-gray-200">4 active agents</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Task Queue:</span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {integrationStatus === 'completed' ? '0 pending / 12 completed' : '5 pending / 7 completed'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 ${activeExperiment ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={activeExperiment !== null}
                  onClick={handleCreateWorkflow}
                >
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Workflow
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-medium shadow hover:shadow-lg transition-all duration-200 ${activeExperiment ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={activeExperiment !== null}
                  onClick={handleImportPRD}
                >
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import PRD
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Workflow Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Workflow</h3>
                <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workflow Name</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter workflow name"
                  defaultValue="New Development Experiment"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template</label>
                <select className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                  <option>Code Generation Workflow</option>
                  <option>Feature Development</option>
                  <option>Bug Fix Automation</option>
                  <option>Testing Pipeline</option>
                  <option>Empty Workflow</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setTimeout(() => {
                      setIsCreating(false);
                      setShowCreateModal(false);
                      setActiveExperiment('exp-002');
                      setIntegrationStatus('running');
                      setTimeout(() => {
                        setIntegrationStatus('completed');
                        setShowWorkflowVisualization(true);
                      }, 2000);
                    }, 1000);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Workflow'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Import PRD Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Import PRD</h3>
                <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {importProgress < 100 ? (
                <>
                  <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Importing PRD and generating workflow...</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${importProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {importProgress < 30 ? 'Analyzing document structure...' : 
                       importProgress < 60 ? 'Extracting requirements and deliverables...' :
                       importProgress < 90 ? 'Generating workflow nodes and connections...' :
                       'Finalizing workflow model...'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">PRD Successfully Imported</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Your workflow has been created from the PRD</p>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Workflow Visualization (shown after completion) */}
        {showWorkflowVisualization && activeExperiment && (
          <div className="mt-4 p-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Workflow Visualization
            </h4>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 overflow-auto" style={{ height: '400px' }}>
              <div className="relative" style={{ width: '800px', height: '350px' }}>
                {/* Workflow Nodes */}
                <div className="absolute top-20 left-50 w-32 h-16 bg-purple-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  Start
                </div>
                
                <svg width="800" height="350" className="absolute top-0 left-0 w-full h-full">
                  <path d="M82 36 L150 100" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M182 100 L250 36" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M282 36 L350 100" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M382 100 L450 36" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M482 36 L550 100" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M582 100 L650 170" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M650 202 L550 250" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M518 250 L400 250" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M368 250 L250 250" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M218 250 L150 170" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#6366F1" />
                    </marker>
                  </defs>
                </svg>
                
                <div className="absolute top-100 left-150 w-32 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  Setup
                </div>
                
                <div className="absolute top-20 left-250 w-32 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  Code Gen
                </div>
                
                <div className="absolute top-100 left-350 w-32 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  Tests
                </div>
                
                <div className="absolute top-20 left-450 w-32 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  Review
                </div>
                
                <div className="absolute top-100 left-550 w-32 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  Build
                </div>
                
                <div className="absolute top-170 left-650 w-32 h-16 bg-green-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  Deploy
                </div>
                
                <div className="absolute top-250 left-550 w-32 h-16 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  Monitor
                </div>
                
                <div className="absolute top-250 left-400 w-32 h-16 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  Analyze
                </div>
                
                <div className="absolute top-250 left-250 w-32 h-16 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  Feedback
                </div>
                
                <div className="absolute top-170 left-150 w-32 h-16 bg-red-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
                  End
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Nodes</div>
                <div className="text-xl font-bold">10</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <div className="text-sm text-gray-500 dark:text-gray-400">Execution Time</div>
                <div className="text-xl font-bold">2.3s</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
                <div className="text-xl font-bold">100%</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <div className="text-sm text-gray-500 dark:text-gray-400">Memory Usage</div>
                <div className="text-xl font-bold">128 MB</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => window.open('https://simstudio.ai/docs', '_blank')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-md"
              >
                Open in Full Editor
              </button>
            </div>
          </div>
        )}

        {/* Integration Status */}
        <div className="px-6 pb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                integrationStatus === 'connecting' ? 'bg-blue-500' :
                integrationStatus === 'ready' ? 'bg-purple-500' :
                integrationStatus === 'running' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}></div>
              <div>
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center">
                  SimStudio Integration Status 
                  <div className="ml-3">
                    {renderStatusBadge()}
                  </div>
                </h5>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {integrationStatus === 'connecting' ? 
                    'Connecting to SimStudio API... Our architecture is prepared for integration with the workflow engine.' :
                    integrationStatus === 'ready' ? 
                    'Ready to execute workflows. Select an experiment above to run its SimStudio workflow.' :
                    integrationStatus === 'running' ? 
                    'SimStudio is executing the workflow for the selected experiment. Real-time progress is being tracked.' :
                    'Workflow execution complete. The experiment results have been processed and are ready for analysis.'
                  }
                </p>
                {integrationStatus === 'completed' && (
                  <div className="mt-2 text-sm">
                    <button 
                      onClick={() => {
                        setActiveExperiment(null);
                        setIntegrationStatus('ready');
                        setShowWorkflowVisualization(false);
                      }}
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Reset and run another experiment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This will be the actual SimStudio integration
  return (
    <div className="bg-white dark:bg-card-dark rounded-lg shadow-card dark:shadow-none h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex-1 flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center max-w-md"
          >
            <Workflow className="h-12 w-12 text-purple-500 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">SimStudio Workflow Editor</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The SimStudio SDK is loading. Once loaded, you'll be able to visually design and execute AI agent workflows.
            </p>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-purple-500"
                animate={{ width: ['0%', '100%'] }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}