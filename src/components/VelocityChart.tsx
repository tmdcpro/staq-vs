import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface VelocityData {
  day: string;
  velocity: number;
  experiments: number;
}

interface VelocityChartProps {
  data: VelocityData[];
}

export function VelocityChart({ data }: VelocityChartProps) {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="bg-white dark:bg-card-dark rounded-lg shadow-card dark:shadow-none p-6 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-success-light/20">
          <TrendingUp className="h-5 w-5 text-success-DEFAULT" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Velocity</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
            <XAxis dataKey="day" stroke={isDark ? "#9CA3AF" : "#6B7280"} />
            <YAxis yAxisId="left" stroke={isDark ? "#9CA3AF" : "#6B7280"} />
            <YAxis yAxisId="right" orientation="right" stroke={isDark ? "#9CA3AF" : "#6B7280"} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: '1px solid',
                borderColor: isDark ? '#374151' : '#E5E7EB',
                borderRadius: '0.5rem',
                color: isDark ? '#FFFFFF' : '#1F2937'
              }}
            />
            <Bar yAxisId="right" dataKey="experiments" fill={isDark ? "#60A5FA" : "#3B82F6"} opacity={0.3} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="velocity" 
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}