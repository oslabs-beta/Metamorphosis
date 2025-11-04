'use client';

import React from 'react';
import LineGraph from '@/app/components/charts/LineGraph';
import { GraphProp } from '@/types';

interface TimelineChartProps {
  title: string;
  data: { x: number[]; y: number[] };
  color?: string;
  unit?: string;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  title,
  data,
  color = 'rgba(7, 132, 200, 0.8)',
  unit = '',
}) => {
  const graphProps: GraphProp = {
    title: unit ? `${title} (${unit})` : title,
    datapoints: data,
    color,
  };

  return (
    <div style={{ padding: '10px' }}>
      <LineGraph graphProps={graphProps} />
    </div>
  );
};

export default TimelineChart;

