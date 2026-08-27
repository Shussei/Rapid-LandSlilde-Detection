import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import type { TelemetryPoint } from '../../types/sensor';

interface ChartProps {
  data: TelemetryPoint[];
}

export const AccelerationChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b' }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 1.5]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0d1522',
              borderColor: '#ffb703',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#fff',
            }}
          />
          <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
          <Line type="monotone" dataKey="accelX" name="X-Axis (g)" stroke="#38bdf8" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="accelY" name="Y-Axis (g)" stroke="#fbbf24" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="accelZ" name="Z-Axis (g)" stroke="#4ade80" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
