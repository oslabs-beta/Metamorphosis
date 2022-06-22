import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Grid from '@mui/material/Grid';
import MetricCard from '../components/charts/MetricCard'
import LineGraph from '../components/charts/LineGraph';
import socket from '../socket';


const BrokerDisplay = () => {
	const [inSyncReplica, setInSyncReplica] = useState(0);
	const [underReplicatedCount, setUnderReplicatedCount] = useState(0);
	const [totBytesIn, setTotBytesIn] = useState({x: [], y:[]});
	


	socket.on("data", (data)=>{
		console.log('incoming message: ',data)


		const { kafka_cluster_partition_insyncreplicascount: inSyncReplica } = data;
		const { kafka_cluster_partition_underreplicated: underReplicatedPartitions } = data;
		const { kafka_controller_controllerstats_autoleaderbalancerateandtimems } = data;
		const { kafka_controller_kafkacontroller_offlinepartitionscount } = data;
		const { kafka_network_requestmetrics_requestbytes_count } = data;
		const { kafka_server_brokertopicmetrics_bytesin_total: totalBytesIn } = data;
		const { kafka_server_brokertopicmetrics_bytesout_total } = data;



		//logic for handling underreplicated partitions
		const uRCount = underReplicatedPartitions.reduce((acc, obj) => {
			if(obj.value !== 0) acc++;
			return acc;

		setUnderReplicatedCount(uRCount);
		})

		//logic for handling total bytes in
		setTotBytesIn(totalBytesIn[0].output);




	});
	

	useEffect(() => {
		socket.emit("range", "360");

	}, [])
	
	// kafka_cluster_partition_insyncreplicascount: (78) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
	// kafka_cluster_partition_underreplicated: (78) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
	// kafka_controller_controllerstats_autoleaderbalancerateandtimems: [{…}]
	// kafka_controller_kafkacontroller_offlinepartitionscount: [{…}]
	// kafka_network_requestmetrics_requestbytes_count: []
	// kafka_server_brokertopicmetrics_bytesin_total: (5) [{…}, {…}, {…}, {…}, {…}]
	// kafka_server_brokertopicmetrics_bytesout_total: (5) [{…}, {…}, {…}, {…}


	const insyncReplica = {
		title: 'In-Sync Replica Count',
		value: underReplicatedCount
	}

	const underreplicated = {
		title: 'Underreplicated Partitions',
		value: underReplicatedCount
	}

	// const offlinePartitions = {
	// 	title: 'Offline Partitions Count',
	// 	value: 5
	// }
	// const requestBytesCount = {
	// 	title: 'Request Bytes Count',
	// 	value: 6
	// }

	const tBytesIn = {
		title: 'Total Bytes In',
		datapoints: totBytesIn
	}

	// const totalBytesOut = {
	// 	title: 'Total Bytes Out',
	// 	x: [4, 5, 6, 7, 8],
	// 	y: [1, 3, 5, 6, 8]
	// }

	return (
		
		<div className='broker'>
			{/* <div>
				<button onClick={clickme}>TestButton</button>
			</div> */}
			<Grid container spacing={2}>
				{/* <Grid item xs={12}>
				  <MetricCard data={insyncReplica} normalVal={2}/>
				</Grid> */}
				 <Grid item xs={12}>
					<MetricCard data={underreplicated} normalVal={0}/>
				</Grid>
				<Grid item xs={12}>
				<LineGraph graphProps={tBytesIn}/>
				</Grid>
				{/*<Grid item xs={3}>
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
				</Grid> */}
			</Grid>
		</div>
		
	)
}

export default BrokerDisplay;