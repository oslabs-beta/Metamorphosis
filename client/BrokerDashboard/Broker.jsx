import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BarChart from '../components/charts/BarChart';
import MetricCard from '../components/charts/MetricCard'
import socket from '../socket';

const BrokerDisplay = () => {
	function clickme(){
		socket.emit("range", '360');
	}
	
	return (
		<>
		<div className='broker'>
			<div>
				<button onClick={clickme}>TestButton</button>
			</div>
			<Grid container spacing={2}>
				<Grid item xs={8}>
					<BarChart />
				</Grid>
				<Grid item xs={4}>
					<MetricCard data={1} normalVal={2}/>
				</Grid>
				<Grid item xs={4}>
				<BarChart />
				</Grid>
				<Grid item xs={8}>
				<BarChart />
				</Grid>
			</Grid>
		</div>
		</>
	)
}

export default BrokerDisplay;