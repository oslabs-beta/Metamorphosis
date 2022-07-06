import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Grid from '@mui/material/Grid';
import LineGraph from '../components/charts/LineGraph';
import socket from '../socket';


const ProducerDisplay = () => {
	const [ioRatio, setIoRatio] = useState({x: [], y:[]});
	const [recErr, setRecErr] = useState({x: [], y:[]});

	socket.on("data", (data)=>{
		console.log('incoming message: ', data)

		//Line graphs
		const { kafka_producer_producer_metrics_io_ratio: ioRat } = data;
		const { kafka_producer_producer_metrics_record_error_rate: recErrRate } = data; 

		//logic for handling io ratio
		setIoRatio(ioRat[0].output);

		//logic for handling request error rate
		setRecErr(recErrRate[0].output);

	});
	

	useEffect(() => {
		socket.emit("range", "360");

	}, [])

	const ioR = {
		title: 'i/o Ratio',
		datapoints: ioRatio,
		color: 'rgba(234, 157, 73, 0.8)'
	}

	const recErrorRate = {
		title: 'Record Error Rate',
		datapoints: recErr,
		color: 'rgba(116, 126, 234, 0.8)'
	}
	
	return (
		
		<div className='dashboard'>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<LineGraph graphProps={ioR}/>
				</Grid>
				<Grid item xs={6}>
					<LineGraph graphProps={recErrorRate}/>
				</Grid>
			</Grid>
		</div>
		
	)
}

export default ProducerDisplay;