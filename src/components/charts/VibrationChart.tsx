import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { TelemetryPoint } from '../../types/sensor';

interface ChartProps {
  data: TelemetryPoint[];
}

export const VibrationChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b' }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 2.0]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0d1522',
              borderColor: '#00f2fe',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#fff',
            }}
          />
          <Line
            type="monotone"
            dataKey="vibration"
            stroke="#00f2fe"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#00f2fe' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
