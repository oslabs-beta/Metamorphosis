
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Grid from '@mui/material/Grid';
import LineGraph from '../components/charts/LineGraph';
import socket from '../socket';


const ConsumerDisplay = () => {
	const [lag, setLag] = useState({x: [], y:[]});
	const [rebalance, setRebalance] = useState({x: [], y:[]});

	socket.on("data", (data)=>{
		console.log('incoming message: ', data)

		//Line graphs
		const { kafka_consumergroup_group_lag: groupL } = data;
		const { kafka_consumer_consumer_coordinator_metrics_rebalance_total: rebTot } = data;


		//logic for handling total bytes in
		setLag(groupL[0].output);

		//logic for handling total bytes out
		setRebalance(rebTot[0].output);

	});
	

	useEffect(() => {
		socket.emit("range", "360");

	}, [])

	const gl = {
		title: 'Group Lag',
		datapoints: lag,
		color: 'rgba(234, 157, 73, 0.8)'
	}

	const rt = {
		title: 'Rebalance Total',
		datapoints: rebalance,
		color: 'rgba(116, 126, 234, 0.8)'
	}
	
	return (
		
		<div className='dashboard'>
			<h1>Consumer Dashboard</h1>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<LineGraph graphProps={gl}/>
				</Grid>
				<Grid item xs={6}>
					<LineGraph graphProps={rt}/>
				</Grid>
			</Grid>
		</div>
		
	)
}

export default ConsumerDisplay;