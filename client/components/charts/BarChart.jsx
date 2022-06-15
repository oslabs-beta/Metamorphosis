import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


//need to import props
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({options, data}) => {

    /* options object form
    options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top' as const,
        },
        title: {
        display: true,
        text: 'Title Goes Here',
        },
    },
    };

  */
  
  /* data object form
    data: {
        //x-axis 
        labels: [],
        //additional lines will be objects in the dataset array
        datasets:[{
            //y-axis data
            label: 'bar1',
            data: []
            //input line color
            backgroundColor: 'rgba(53, 162, 235, 0.5)';
        }],

    }

  */
  return (
    <Bar
      options={options}
      data={data} 
    />
  )
}

export default BarChart;