import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield } from 'lucide-react';

interface QualityData {
  day: string;
  coverage: number;
  score: number;
}

interface QualityTrendProps {
  data: QualityData[];
}

export function QualityTrend({ data }: QualityTrendProps) {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="bg-white dark:bg-card-dark rounded-lg shadow-card dark:shadow-none p-6 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-warning-light/20">
          <Shield className="h-5 w-5 text-warning-DEFAULT" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quality Metrics</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
            <XAxis dataKey="day" stroke={isDark ? "#9CA3AF" : "#6B7280"} />
            <YAxis domain={[0, 100]} stroke={isDark ? "#9CA3AF" : "#6B7280"} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: '1px solid',
                borderColor: isDark ? '#374151' : '#E5E7EB',
                borderRadius: '0.5rem',
                color: isDark ? '#FFFFFF' : '#1F2937'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="coverage" 
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
              name="Test Coverage %"
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
              name="Quality Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}