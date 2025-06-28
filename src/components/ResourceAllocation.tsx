import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users } from 'lucide-react';

interface ResourceData {
  team: string;
  experiments: number;
  utilization: number;
}

interface ResourceAllocationProps {
  data: ResourceData[];
}

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6'];

export function ResourceAllocation({ data }: ResourceAllocationProps) {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="bg-white dark:bg-card-dark rounded-lg shadow-card dark:shadow-none p-6 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary-light/20">
          <Users className="h-5 w-5 text-primary-DEFAULT" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resource Allocation</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
            <XAxis type="number" domain={[0, 100]} stroke={isDark ? "#9CA3AF" : "#6B7280"} />
            <YAxis dataKey="team" type="category" stroke={isDark ? "#9CA3AF" : "#6B7280"} width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: '1px solid',
                borderColor: isDark ? '#374151' : '#E5E7EB',
                borderRadius: '0.5rem',
                color: isDark ? '#FFFFFF' : '#1F2937'
              }}
              formatter={(value, name) => [`${value}%`, name === 'utilization' ? 'Utilization' : 'Experiments']}
            />
            <Bar dataKey="utilization" fill="#3B82F6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={item.team} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-gray-600 dark:text-gray-300">{item.team}</span>
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {item.experiments} exp • {item.utilization}% util
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}