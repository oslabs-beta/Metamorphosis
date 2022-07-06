import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Grid from '@mui/material/Grid';
import MetricCard from '../components/charts/MetricCard'
import LineGraph from '../components/charts/LineGraph';
import socket from '../socket';
import Dropdown from '../components/Dropdown'


const BrokerDisplay = () => {
	const [actController, setActController] = useState(null);
	const [actBroker, setActBroker] = useState(null);
	const [underReplicatedCount, setUnderReplicatedCount] = useState(null);
	const [offPartitions, setOffPartitions] = useState(null);


	const [jvm, setJvm] = useState({x: [], y:[]});
	const [totBytesIn, setTotBytesIn] = useState({x: [], y:[]});
	const [totBytesOut, setTotBytesOut] = useState({x: [], y:[]});
	const [reqQueue, setReqQueue] = useState({x: [], y:[]});
	const [resSend, setResSend] = useState({x: [], y:[]});

	socket.on("data", (data)=>{
		console.log('incoming message: ', data)

		//Metric counters
		const { kafka_controller_kafkacontroller_activebrokercount: activeBrokerCount } = data;
		const { kafka_controller_kafkacontroller_activecontrollercount: activeControllerCount } = data; 
		const { kafka_cluster_partition_underreplicated: underReplicatedPartitions } = data;
		const { kafka_controller_kafkacontroller_offlinepartitionscount: offlinePartitions } = data;


		//Line graphs
		const { jvm_memory_bytes_used: jvmBytesUsed } = data;
		const { kafka_server_brokertopicmetrics_bytesin_total: totalBytesIn } = data;
		const { kafka_server_brokertopicmetrics_bytesout_total: totalBytesOut } = data;
		const { kafka_network_requestmetrics_requestqueuetimems:requestQueueTimes} = data;
		const { kafka_network_requestmetrics_responsesendtimems: responseSendTimes } = data;

		//logic for handling active controller count
		setActController(activeControllerCount[0].value);

		//logic for handling active broker count
		setActBroker(activeBrokerCount[0].value);

		//logic for handling underreplicated partitions
		const uRCount = underReplicatedPartitions.reduce((acc, obj) => {
			if(obj.value !== 0) acc++;
			return acc;
		}, 0)

		setUnderReplicatedCount(uRCount);

		//logic for handling offline partitions
		setOffPartitions(offlinePartitions[0].value);
		
		
		//logic for handling jvm_memory_bytes_used
		setJvm(jvmBytesUsed[0].output);

		//logic for handling total bytes in
		setTotBytesIn(totalBytesIn[0].output);

		//logic for handling total bytes out
		setTotBytesOut(totalBytesOut[0].output);

		//logic for handling request queue time
		setReqQueue(requestQueueTimes[0].output);

		//logic for handling response send time
		setResSend(responseSendTimes[0].output);

	});
	

	useEffect(() => {
		socket.emit("range", "360");

	}, [])

	//counters
	const activeController = {
		title: 'Active Controller',
		value: actController
	}

	const activeBroker = {
		title: 'Active Brokers',
		value: actBroker
	}

	const underreplicated = {
		title: 'Underreplicated Partitions',
		value: underReplicatedCount
	}

	const offlinePartitions = {
		title: 'Offline Partitions Count',
		value: offPartitions
	}


	//charts
	const jvmUsed = {
		title: 'JVM Bytes Used',
		datapoints: totBytesIn,
		color: 'rgba(191, 104, 149, 0.8)'
	}

	const tBytesIn = {
		title: 'Total Bytes In',
		datapoints: totBytesIn,
		color: 'rgba(7, 132, 200, 0.8)'
	}

	const tBytesOut = {
		title: 'Total Bytes Out',
		datapoints: totBytesOut,
		color: 'rgba(100, 200, 7, 0.8)'
	}

	const reqQueueTimes = {
		title: 'Request Queue Times',
		datapoints: reqQueue,
		color: 'rgba(234, 157, 73, 0.8)'
	}

	const resSendTimes = {
		title: 'Response Send Times',
		datapoints: resSend,
		color: 'rgba(116, 126, 234, 0.8)'
	}
	// rgba(191, 104, 149, 0.8)
	// rgba(234, 157, 73, 0.8)
	// rgba(234, 93, 73, 0.8)
	// rgba(7, 200, 176, 0.8)
	// rgba(7, 132, 200, 0.8)
	// rgba(116, 126, 234, 0.8)
	// rgba(234, 116, 136, 0.8)
	
	const items = [
		{
			id: 1, 
			value: '15 Minutes'
		}, 
		{
			id: 2, 
			value: '30 Minutes'
		}, 
		{
			id: 3, 
			value: '60 Minutes'
		}, 
		{
			id: 4, 
			value: '360 Minutes'
		}
	]

	return (
		
		<div className='broker'>
			<Dropdown title = 'Select time interval' items={items}/>
			<Grid container spacing={2}>
				<Grid item xs={3}>
				  <MetricCard data={activeBroker} normalVal={1000}/>
				</Grid>
				<Grid item xs={3}>
				  <MetricCard data={activeController} normalVal={1}/>
				</Grid>
				 <Grid item xs={3}>
					<MetricCard data={underreplicated} normalVal={0}/>
				</Grid>
				<Grid item xs={3}>
					<MetricCard data={offlinePartitions} normalVal={0}/>
				</Grid>
				<Grid id="jvmUsed" item xs={4}>
					<LineGraph graphProps={jvmUsed}/>
				</Grid>
				<Grid item xs={4}>
					<LineGraph graphProps={tBytesIn}/>
				</Grid>
				<Grid item xs={4}>
					<LineGraph graphProps={tBytesOut}/>
				</Grid>
				<Grid item xs={6}>
					<LineGraph graphProps={reqQueueTimes}/>
				</Grid>
				<Grid item xs={6}>
					<LineGraph graphProps={resSendTimes}/>
				</Grid>
			</Grid>
		</div>
		
	)
}

export default BrokerDisplay;