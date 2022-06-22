import React, { useEffect } from 'react';
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

// const LineGraph = ({options, data}) => {
const LineGraph = ({graphProps}) => {
  const { title, x, y } = graphProps;

  const options = {

    animation: false,
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: title
        },
    },
  };

  const data = {
    //x-axis 
    labels: x,
    //additional lines will be a new object in the dataset
    datasets:[{
      //y-axis data
      label: 'line1',
      data: y,
      //input line color
      borderColor: 'rgb(255,255,255,0.5)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }],

  }  
    

  return (
    <Line
      options={options}
      data={data}
    />
  )
}

export default LineGraph;