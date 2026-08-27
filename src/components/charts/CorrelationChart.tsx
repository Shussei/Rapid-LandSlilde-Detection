import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { TelemetryPoint } from '../../types/sensor';

interface ChartProps {
  data: TelemetryPoint[];
}

export const CorrelationChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCorr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff2a5f" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b' }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 1.0]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0d1522',
              borderColor: '#ff2a5f',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#fff',
            }}
          />
          <Area
            type="monotone"
            dataKey="correlation"
            stroke="#ff2a5f"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCorr)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
