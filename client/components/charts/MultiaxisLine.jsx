import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



// options object form






/* data object form
data = {
     //x-axis labels
  labels:[],
  
  datasets: [
        //left axis
    {
      label: 'Dataset 1',
      data: [...],
      borderColor: 'rgb(255, 255, 0)',
      backgroundColor: 'rgba(255, 255, 0, 0.5)',
      yAxisID: 'y',
    },
        //right axis
    {
      label: 'Dataset 2',
      data: [...]
      borderColor: 'rgb(0, 255, 255)',
      backgroundColor: 'rgba(0, 255, 255, 0.5)',
      yAxisID: 'y1',
    },
  ],
  };
*/

const MultiaxisLine = ({title, data}) => {

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };






  return (
    <Line 
      options={options}
      data={data}  
    />
  )
};


export default MultiaxisLine;
