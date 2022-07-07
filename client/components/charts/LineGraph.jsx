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
import unixTimeStamptoTime from '../../timestamp'

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
  const { title, datapoints, color } = graphProps;

  const options = {
    animation: false,
    responsive: true,
    plugins: {
        // legend: {
        // position: 'top',
        // },
        title: {
        display: true,
        text: title
        },
    },
  };

  const data = {
    //x-axis 
    labels: datapoints.x.map(el => unixTimeStamptoTime(el)),
    //additional lines will be a new object in the dataset
    datasets:[{
      //y-axis data
      label: title,
      data: datapoints.y,
      //input line color
      borderColor: color,
      backgroundColor: color,
    }],

  }  

  const borderColors = [
    ''
  ]

  return (
    <Line
      options={options}
      data={data}
    />
  )
}

export default LineGraph;