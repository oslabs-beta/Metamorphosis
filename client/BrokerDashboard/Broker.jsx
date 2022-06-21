import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BarChart from '../components/charts/BarChart';
import MetricCard from '../components/charts/MetricCard'
import LineGraph from '../components/charts/LineGraph';

const BrokerDisplay = () => {

	const data1 = {
		title: 'metric1',
		value: 2
	}

	const data2 = {
		title: 'metric2',
		value: 4
	}

	const data3 = {
		title: 'metric3',
		value: 5
	}
	const data4 = {
		title: 'metric4',
		value: 6
	}

	const data5 = {
		title: 'My line chart',
		x: [4, 5, 6, 7, 8],
		y: [1, 3, 5, 6, 8]
	}


	return (
		<div className='broker'>
			<Grid container spacing={2}>
				<Grid item xs={3}>
				  <MetricCard data={data1} normalVal={2}/>
				</Grid>
				<Grid item xs={3}>
					<MetricCard data={data2} normalVal={2}/>
				</Grid>
				<Grid item xs={3}>
					<MetricCard data={data3} normalVal={2}/>
				</Grid>
				<Grid item xs={3}>
					<MetricCard data={data4} normalVal={2}/>
				</Grid>
				<Grid item xs={6}>
				<BarChart />
				</Grid>
				<Grid item xs={6}>
				<LineGraph graphProps={data5}/>
				</Grid>
			</Grid>
		</div>
	)
}

export default BrokerDisplay;