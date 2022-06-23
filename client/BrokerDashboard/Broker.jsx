import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Grid from '@mui/material/Grid';
import MetricCard from '../components/charts/MetricCard'
import LineGraph from '../components/charts/LineGraph';
import socket from '../socket';


// {
//   "request": {
//     "url": "api/datasources/proxy/9/api/v1/query_range?query=count(kafka_server_replicamanager_leadercount%7Bjob%3D%22kafka%22%2Cenv%3D%22dev%22%2Cinstance%3D~%22kafka-1%3A1234%7Ckafka-3%3A1234%22%7D)&start=1655944020&end=1655944920&step=15",
//     "method": "GET"
//   },
//   "response": {
//     "status": "success",
//     "data": {
//       "resultType": "matrix",
//       "result": []
//     }
//   }
// }

// {
//   "request": {
//     "url": "api/datasources/proxy/9/api/v1/query_range?query=sum(kafka_server_replicamanager_partitioncount%7Bjob%3D%22kafka%22%2Cenv%3D%22dev%22%2Cinstance%3D~%22kafka-1%3A1234%7Ckafka-3%3A1234%22%7D)&start=1655944065&end=1655944965&step=15",
//     "method": "GET"
//   },
//   "response": {
//     "status": "success",
//     "data": {
//       "resultType": "matrix",
//       "result": [
//         {
//           "metric": {},
//           "values": [
//             [
//               1655944935,
//               "139"
//             ],
//             [
//               1655944950,
//               "139"
//             ],
//             [
//               1655944965,
//               "139"
//             ]
//           ]
//         }
//       ]
//     }
//   }
// }



// {
//   "request": {
//     "url": "api/datasources/proxy/9/api/v1/query_range?query=sum(kafka_log_log_size%7Bjob%3D%22kafka%22%2Cenv%3D%22dev%22%2Cinstance%3D~%22kafka-1%3A1234%7Ckafka-2%3A1234%7Ckafka-3%3A1234%22%7D)%20by%20(topic)&start=1655944125&end=1655945025&step=15",
//     "method": "GET"
//   },
//   "response": {
//     "status": "success",
//     "data": {
//       "resultType": "matrix",
//       "result": [
//         {
//           "metric": {
//             "topic": "__confluent.support.metrics"
//           },
//           "values": [
//             [
//               1655944860,
//               "0"
//             ],
//             [
//               1655944920,
//               "0"
//             ],
//             [
//               1655944935,
//               "0"
//             ],
//             [
//               1655944965,
//               "0"
//             ],
//             [
//               1655944980,
//               "0"
//             ],
//             [
//               1655944995,
//               "0"
//             ],
//             [
//               1655945010,
//               "0"
//             ],
//             [
//               1655945025,
//               "0"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "topic": "__consumer_offsets"
//           },
//           "values": [
//             [
//               1655944860,
//               "5032584"
//             ],
//             [
//               1655944920,
//               "2516292"
//             ],
//             [
//               1655944935,
//               "5035904"
//             ],
//             [
//               1655944950,
//               "2522851"
//             ],
//             [
//               1655944965,
//               "5052941"
//             ],
//             [
//               1655944980,
//               "5063075"
//             ],
//             [
//               1655944995,
//               "7613400"
//             ],
//             [
//               1655945010,
//               "7625404"
//             ],
//             [
//               1655945025,
//               "7647038"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "topic": "__transaction_state"
//           },
//           "values": [
//             [
//               1655944860,
//               "15760296"
//             ],
//             [
//               1655944920,
//               "7880148"
//             ],
//             [
//               1655944935,
//               "15764812"
//             ],
//             [
//               1655944950,
//               "7899522"
//             ],
//             [
//               1655944965,
//               "15819676"
//             ],
//             [
//               1655944980,
//               "15854248"
//             ],
//             [
//               1655944995,
//               "23846794"
//             ],
//             [
//               1655945010,
//               "23884520"
//             ],
//             [
//               1655945025,
//               "23958970"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "topic": "connect-configs"
//           },
//           "values": [
//             [
//               1655944860,
//               "1560"
//             ],
//             [
//               1655944920,
//               "780"
//             ],
//             [
//               1655944935,
//               "1560"
//             ],
//             [
//               1655944950,
//               "780"
//             ],
//             [
//               1655944965,
//               "1560"
//             ],
//             [
//               1655944980,
//               "1560"
//             ],
//             [
//               1655944995,
//               "2340"
//             ],
//             [
//               1655945010,
//               "2340"
//             ],
//             [
//               1655945025,
//               "2340"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "topic": "connect-offsets"
//           },
//           "values": [
//             [
//               1655944860,
//               "0"
//             ],
//             [
//               1655944920,
//               "0"
//             ],
//             [
//               1655944935,
//               "0"
//             ],
//             [
//               1655944950,
//               "0"
//             ],
//             [
//               1655944965,
//               "0"
//             ],
//             [
//               1655944980,
//               "0"
//             ],
//             [
//               1655944995,
//               "0"
//             ],
//             [
//               1655945010,
//               "0"
//             ],
//             [
//               1655945025,
//               "0"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "topic": "connect-status"
//           },
//           "values": [
//             [
//               1655944860,
//               "0"
//             ],
//             [
//               1655944920,
//               "0"
//             ],
//             [
//               1655944935,
//               "0"
//             ],
//             [
//               1655944950,
//               "0"
//             ],
//             [
//               1655944965,
//               "0"
//             ],
//             [
//               1655944980,
//               "0"
//             ],
//             [
//               1655944995,
//               "0"
//             ],
//             [
//               1655945010,
//               "0"
//             ],
//             [
//               1655945025,
//               "0"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "topic": "count-even-odd-entries"
//           },
//           "values": [
//             [
//               1655944860,
//               "1320542"
//             ],
//             [
//               1655944920,
//               "660271"
//             ],
//             [
//               1655944935,
//               "1320542"
//             ],
//             [
//               1655944950,
//               "661532"
//             ],
//             [
//               1655944965,
//               "1324245"
//             ],
//             [
//               1655944980,
//               "1326880"
//             ],
//             [
//               1655944995,
//               "1995438"
//             ],
//             [
//               1655945010,
//               "1998747"
//             ],
//             [
//               1655945025,
//               "2004789"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "topic": "sample"
//           },
//           "values": [
//             [
//               1655944860,
//               "770100"
//             ],
//             [
//               1655944920,
//               "387490"
//             ],
//             [
//               1655944935,
//               "777164"
//             ],
//             [
//               1655944950,
//               "389674"
//             ],
//             [
//               1655944965,
//               "782540"
//             ],
//             [
//               1655944980,
//               "785078"
//             ],
//             [
//               1655944995,
//               "1181357"
//             ],
//             [
//               1655945010,
//               "1184587"
//             ],
//             [
//               1655945025,
//               "1188242"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "topic": "sample-streams-KSTREAM-AGGREGATE-STATE-STORE-0000000002-changelog"
//           },
//           "values": [
//             [
//               1655944860,
//               "1320782"
//             ],
//             [
//               1655944920,
//               "660391"
//             ],
//             [
//               1655944935,
//               "1320862"
//             ],
//             [
//               1655944950,
//               "661907"
//             ],
//             [
//               1655944965,
//               "1325408"
//             ],
//             [
//               1655944980,
//               "1327750"
//             ],
//             [
//               1655944995,
//               "1996901"
//             ],
//             [
//               1655945010,
//               "1999599"
//             ],
//             [
//               1655945025,
//               "2006095"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "topic": "sample-streams-KSTREAM-AGGREGATE-STATE-STORE-0000000002-repartition"
//           },
//           "values": [
//             [
//               1655944860,
//               "1359994"
//             ],
//             [
//               1655944920,
//               "679997"
//             ],
//             [
//               1655944935,
//               "1362010"
//             ],
//             [
//               1655944950,
//               "683408"
//             ],
//             [
//               1655944965,
//               "1370043"
//             ],
//             [
//               1655944980,
//               "1373539"
//             ],
//             [
//               1655944995,
//               "2066504"
//             ],
//             [
//               1655945010,
//               "2070340"
//             ],
//             [
//               1655945025,
//               "2077018"
//             ]
//           ]
//         }
//       ]
//     }
//   }
// }

// {
//   "request": {
//     "url": "api/datasources/proxy/9/api/v1/query_range?query=kafka_network_socketserver_networkprocessoravgidlepercent%7Bjob%3D%22kafka%22%2Cenv%3D%22dev%22%2Cinstance%3D~%22kafka-1%3A1234%7Ckafka-2%3A1234%7Ckafka-3%3A1234%22%7D&start=1655944230&end=1655945130&step=15",
//     "method": "GET"
//   },
//   "response": {
//     "status": "success",
//     "data": {
//       "resultType": "matrix",
//       "result": [
//         {
//           "metric": {
//             "__name__": "kafka_network_socketserver_networkprocessoravgidlepercent",
//             "env": "dev",
//             "instance": "kafka-1:1234",
//             "job": "kafka"
//           },
//           "values": [
//             [
//               1655944935,
//               "0.9855511332647264"
//             ],
//             [
//               1655944950,
//               "0.9889565445686381"
//             ],
//             [
//               1655944965,
//               "0.9958397265967524"
//             ],
//             [
//               1655944980,
//               "0.9973334038121388"
//             ],
//             [
//               1655944995,
//               "0.9982230707661275"
//             ],
//             [
//               1655945010,
//               "0.9980734396632384"
//             ],
//             [
//               1655945025,
//               "0.9999910692418806"
//             ],
//             [
//               1655945040,
//               "1"
//             ],
//             [
//               1655945055,
//               "1"
//             ],
//             [
//               1655945070,
//               "0.9999462475827374"
//             ],
//             [
//               1655945085,
//               "0.9998553507280098"
//             ],
//             [
//               1655945100,
//               "0.9999913649484848"
//             ],
//             [
//               1655945115,
//               "1"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "__name__": "kafka_network_socketserver_networkprocessoravgidlepercent",
//             "env": "dev",
//             "instance": "kafka-2:1234",
//             "job": "kafka"
//           },
//           "values": [
//             [
//               1655944920,
//               "0.9940016986514264"
//             ],
//             [
//               1655944935,
//               "0.9965663677611664"
//             ],
//             [
//               1655944965,
//               "0.9994368686506007"
//             ],
//             [
//               1655944980,
//               "0.9941898721138142"
//             ],
//             [
//               1655944995,
//               "0.9910909529105513"
//             ],
//             [
//               1655945010,
//               "0.9971683008092098"
//             ],
//             [
//               1655945025,
//               "0.9984611786453795"
//             ],
//             [
//               1655945040,
//               "1"
//             ],
//             [
//               1655945055,
//               "0.9992989808866911"
//             ],
//             [
//               1655945085,
//               "0.9995930334608257"
//             ],
//             [
//               1655945100,
//               "0.999649095830032"
//             ],
//             [
//               1655945115,
//               "1"
//             ],
//             [
//               1655945130,
//               "0.9946493616676229"
//             ]
//           ]
//         },
//         {
//           "metric": {
//             "__name__": "kafka_network_socketserver_networkprocessoravgidlepercent",
//             "env": "dev",
//             "instance": "kafka-3:1234",
//             "job": "kafka"
//           },
//           "values": [
//             [
//               1655944995,
//               "0.907555056305426"
//             ],
//             [
//               1655945010,
//               "0.9193679555608308"
//             ],
//             [
//               1655945025,
//               "0.9219283970385169"
//             ],
//             [
//               1655945055,
//               "0.9324440906119521"
//             ],
//             [
//               1655945070,
//               "0.9576441194306365"
//             ],
//             [
//               1655945085,
//               "0.9547936782420127"
//             ],
//             [
//               1655945100,
//               "0.9552197293603985"
//             ],
//             [
//               1655945115,
//               "0.958719429653715"
//             ],
//             [
//               1655945130,
//               "0.9386165941482383"
//             ]
//           ]
//         }
//       ]
//     }
//   }
// }

const BrokerDisplay = () => {
	const [inSyncReplica, setInSyncReplica] = useState(null);
	const [underReplicatedCount, setUnderReplicatedCount] = useState(null);
	const [offPartitions, setOffPartitions] = useState(null);
	const [totBytesIn, setTotBytesIn] = useState({x: [], y:[]});
	const [totBytesOut, setTotBytesOut] = useState({x: [], y:[]});


	socket.on("data", (data)=>{
		console.log('incoming message: ',data)


		const { kafka_cluster_partition_insyncreplicascount: inSyncReplica } = data;
		const { kafka_cluster_partition_underreplicated: underReplicatedPartitions } = data;
		const { kafka_controller_controllerstats_autoleaderbalancerateandtimems } = data;
		const { kafka_controller_kafkacontroller_offlinepartitionscount: offlinePartitions } = data;
		const { kafka_network_requestmetrics_requestbytes_count } = data;
		const { kafka_server_brokertopicmetrics_bytesin_total: totalBytesIn } = data;
		const { kafka_server_brokertopicmetrics_bytesout_total: totalBytesOut } = data;
		// const { kafka_network_processor_idlepercent: idlePercent } = data;


		//logic for handling underreplicated partitions
		const uRCount = underReplicatedPartitions.reduce((acc, obj) => {
			if(obj.value !== 0) acc++;
			return acc;
		}, 0)


		setUnderReplicatedCount(uRCount);

		//logic for handling offline partitions
		console.log('offlinepartitions', )
		setOffPartitions(offlinePartitions[0].value);
		

		//logic for handling total bytes in
		setTotBytesIn(totalBytesIn[0].output);

		setTotBytesOut(totalBytesOut[0].output);




	});
	

	useEffect(() => {
		socket.emit("range", "360");

	}, [])

	const underreplicated = {
		title: 'Underreplicated Partitions',
		value: underReplicatedCount
	}

	const offlinePartitions = {
		title: 'Offline Partitions Count',
		value: offPartitions
	}
	// const requestBytesCount = {
	// 	title: 'Request Bytes Count',
	// 	value: 6
	// }

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
	// rgba(191, 104, 149, 0.8)
	// rgba(234, 157, 73, 0.8)
	// rgba(234, 93, 73, 0.8)
	// rgba(7, 200, 176, 0.8)
	// rgba(7, 132, 200, 0.8)
	// rgba(116, 126, 234, 0.8)
	// rgba(234, 116, 136, 0.8)
	
	return (
		
		<div className='broker'>
			{/* <div>
				<button onClick={clickme}>TestButton</button>
			</div> */}
			<Grid container spacing={2}>
				{/* <Grid item xs={12}>
				  <MetricCard data={insyncReplica} normalVal={2}/>
				</Grid> */}
				 <Grid item xs={3}>
					<MetricCard data={underreplicated} normalVal={0}/>
				</Grid>
				<Grid item xs={3}>
					<MetricCard data={offlinePartitions} normalVal={0}/>
				</Grid>
				<Grid item xs={6}>
					<LineGraph graphProps={tBytesIn}/>
				</Grid>
				<Grid item xs={6}>
					<LineGraph graphProps={tBytesOut}/>
				</Grid>
				{/*
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