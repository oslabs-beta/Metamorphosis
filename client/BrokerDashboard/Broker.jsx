import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BarChart from '../components/charts/BarChart';
import MetricCard from '../components/charts/MetricCard'
import LineGraph from '../components/charts/LineGraph';

const BrokerDisplay = () => {

	const insyncReplica = {
		title: 'In-Sync Replica Count',
		value: 1
	}

	const underreplicated = {
		title: 'Underreplicated Partitions',
		value: 4
	}

	const offlinePartitions = {
		title: 'Offline Partitions Count',
		value: 5
	}
	const requestBytesCount = {
		title: 'Request Bytes Count',
		value: 6
	}

	const totalBytesIn = {
		title: 'Total Bytes In',
		x: [4, 5, 6, 7, 8],
		y: [1, 3, 5, 6, 8]
	}

	const totalBytesOut = {
		title: 'Total Bytes Out',
		x: [4, 5, 6, 7, 8],
		y: [1, 3, 5, 6, 8]
	}


	return (
		<div className='broker'>
			<Grid container spacing={2}>
				<Grid item xs={3}>
				  <MetricCard data={insyncReplica} normalVal={2}/>
				</Grid>
				<Grid item xs={3}>
					<MetricCard data={underreplicated} normalVal={2}/>
				</Grid>
				<Grid item xs={3}>
					<MetricCard data={offlinePartitions} normalVal={2}/>
				</Grid>
				<Grid item xs={3}>
					<MetricCard data={requestBytesCount} normalVal={2}/>
				</Grid>
				<Grid item xs={6}>
				<LineGraph graphProps={totalBytesIn}/>
				</Grid>
				<Grid item xs={6}>
				<LineGraph graphProps={totalBytesOut}/>
				</Grid>
				<Grid item xs={6}>
				<LineGraph graphProps={totalBytesIn}/>
				</Grid>
				<Grid item xs={6}>
				<LineGraph graphProps={totalBytesOut}/>
				</Grid>
			</Grid>
		</div>
	)
}

export default BrokerDisplay;