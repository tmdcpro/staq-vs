import React from 'react';
import { Moon, Sun, GitBranch, Code, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { ExperimentPath } from './components/ExperimentPath';
import { ProjectOverview } from './components/ProjectOverview';
import { DAGVisualization } from './components/DAGVisualization';
import { SimStudioIntegration } from './components/SimStudioIntegration';
import { VelocityChart } from './components/VelocityChart';
import { QualityTrend } from './components/QualityTrend';
import { ResourceAllocation } from './components/ResourceAllocation';
import { RecentEvents } from './components/RecentEvents';
import { useDevWorkflowData } from './hooks/useDevWorkflowData';

export function App() {
  const [darkMode, setDarkMode] = React.useState(true);
  const data = useDevWorkflowData();

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleExperiment = (experimentId: string) => {
    console.log(`Toggling experiment: ${experimentId}`);
    // In a real app, this would update the experiment status
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white transition-colors duration-200 bg-gradient-dots bg-dots-sm dark:bg-gradient-dark">
      <div 
        className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }}
      />
      
      <nav className="bg-white/80 dark:bg-card-dark/30 backdrop-blur-xl border-b border-gray-200/20 dark:border-white/5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Code className="h-8 w-8 text-accent-purple" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
                  Dev Workflow Orchestrator
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Parallel development experiment monitoring</p>
              </div>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
            >
              {darkMode ? (
                <Sun className="h-6 w-6 text-warning-light" />
              ) : (
                <Moon className="h-6 w-6 text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Project Overview */}
        <div className="mb-6">
          <ProjectOverview {...data.projectOverview} />
        </div>

        {/* DAG Visualization */}
        <div className="mb-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DAGVisualization
              onNodeInteraction={(event) => {
                console.log('Node interaction:', event);
                // Handle node interactions - could open experiment details, etc.
              }}
            />
            <SimStudioIntegration
              onWorkflowChange={(workflow) => {
                console.log('SimStudio workflow updated:', workflow);
                // Handle workflow changes
              }}
            />
          </div>
        </div>

        {/* Experiment Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {Object.entries(data.experiments).map(([key, experiment], index) => (
            <ExperimentPath
              key={key}
              {...experiment}
              color={index === 0 ? 'primary' : index === 1 ? 'warning' : 'success'}
              onTogglePause={handleToggleExperiment}
            />
          ))}
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <VelocityChart data={data.dailyVelocity} />
          <QualityTrend data={data.qualityTrend} />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceAllocation data={data.resourceAllocation} />
          <RecentEvents events={data.recentEvents} />
        </div>
      </main>
    </div>
  );
}