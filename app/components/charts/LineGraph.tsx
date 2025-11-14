'use client';

import { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import unixTimeStamptoTime from '@/lib/utils/timestamp';
import { GraphProp } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  graphProps: GraphProp;
}

const LineGraph: React.FC<LineGraphProps> = ({ graphProps }) => {
  const { title, datapoints, color } = graphProps;

  const options = {
    animation: false,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
  };

  const data = {
    labels: datapoints.x.map((el: number) => unixTimeStamptoTime(el)),
    datasets: [
      {
        label: title,
        data: datapoints.y,
        borderColor: color,
        backgroundColor: color,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default LineGraph;

