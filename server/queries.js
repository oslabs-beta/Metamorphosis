const axios = require('axios');

const queries_count = {
  // data come in as an array with metric.partition, metric.topic and each time point value at metric.value[1]
  kafka_cluster_partition_insyncreplicascount:[],

  // data come in as an array with metric.partition, metric.topic and each time point value at metric.value[1]
  kafka_cluster_partition_underreplicated: [],
  
  // data come in as an array with metric.partition, metric.topic and each time point value at metric.value[1]
  kafka_controller_kafkacontroller_offlinepartitionscount: [],
  
  // data come in as an array with metric.request and each time point value at metric.value[1]
  kafka_network_requestmetrics_requestbytes_count: []
}

const queries_chart = {
  kafka_server_brokertopicmetrics_bytesin_total: {},
  kafka_server_brokertopicmetrics_bytesout_total: {},

  // metric has a new key 'quantile' and an array with time point & value
  kafka_controller_controllerstats_autoleaderbalancerateandtimems: {}
}

let queries = {};
let ipInCache = {ip: null};

function query(socket, ip){
  // temporarily rerout to local host to save AWS cost
  ip = 'localhost:9090';
  ipInCache.ip = ip;
  
    
  // these new key/value pairs to queries and emit it back to the frontend
  // calling query_count and update the queries_count, then assign 
  query_count(socket, ip);
  query_chart(socket, ip);
};

function query_count(socket, ip){
  console.log(ip)
  for (const key of Object.keys(queries_count)) {
    axios.get(`http://${ip}/api/v1/query`,{ 
      params: {
        query: key,
      }})
      .then(res =>{
        // console.log('query_count/received data: ',res.data);
        return res.data;
      }) 
      .then(res => {
        // console.log('length of the data: ', res.data.result.length);
        let retrieved_data = [];
        res.data.result.forEach(x => {
          const obj = {};
          // this doesn't make too much sense to me since the structure can be different
          // maybe send back obj.metric and obj.value? 
          obj['instance'] = x.metric.instance;
          obj['job'] = x.metric.job;
          obj['partition'] = x.metric.partition? x.metric.partition: null;
          obj['topic'] = x.metric.topic? x.metric.topic: null;
          obj['request'] = x.metric.request? x.metric.request: null;
          obj['value'] = x.value[1];
          retrieved_data.push(obj);
        });  
        queries_count[key] = retrieved_data;
        queries = {...queries_count};
        socket.emit("data", queries);
      })
      .catch(err => console.log(err.code))
  };
};

function query_chart(socket, ip = ipInCache, interval = 15){
  // for some reason I can get default ip, but it's the entire object of ipInCache
  // I can't make it come in as ipinCache.ip 
  // so the if statement is to make it into the correct string
  if(ip instanceof Object){ip = ip.ip;}
  console.log('ip', ip, interval)
  
  // for (const key of Object.keys(queries_count)) {
  //   axios.get(`http://${ip}/api/v1/query_range`,{ 
  //     params: {
  //       query: key,
  //       start: 'calculate from input time',
  //       end:'inputTime',
  //       step: 'check lookup table',
  //     }})
  //     .then(res =>{
  //       // console.log('query_count/received data: ',res.data);
  //       return res.data;
  //     }) 
  //     .then(res => {
  //       // console.log('length of the data: ', res.data.result.length);
  //       let retrieved_data = [];
  //       res.data.result.forEach(x => {
  //         const obj = {};
  //         // this doesn't make too much sense to me since the structure can be different
  //         // maybe send back obj.metric and obj.value? 
  //         obj['instance'] = x.metric.instance;
  //         obj['job'] = x.metric.job;
  //         obj['partition'] = x.metric.partition? x.metric.partition: null;
  //         obj['topic'] = x.metric.topic? x.metric.topic: null;
  //         obj['request'] = x.metric.request? x.metric.request: null;
  //         obj['value'] = x.value[1];
  //         retrieved_data.push(obj);
  //       });  
  //       queries_count[key] = retrieved_data;
  //       queries = {...queries_count};
  //       socket.emit("data", queries);
  //     })
  //     .catch(err => console.log(err.code))
  // };
};



  
  module.exports = {query, query_chart, queries, queries_count, queries_chart, ipInCache};
  // res.data.result is an array. Here's an example: 
  // "result": [
  //   {
  //       "metric": {
  //           "__name__": "kafka_server_brokertopicmetrics_bytesin_total",
  //           "instance": "172.31.1.31:8080",
  //           "job": "kafka"
  //       },
  //       "value": [
  //           1655748501.005,
  //           "75672"
  //       ]
  //   },...]
  


  // Log Flush Latency
  // kafka.log: type=LogFlushStats, name=LogFlushRateAndTimeMs
  
  // I/O Wait Time
  // Controller state
  // Producer response rate
  // Latency
  // Uptime
  // Physical Memory
  // Heap Memory
  // Elapsed time
  // Thread count
  // Memory pool
  // Leader Election Rate
  
  // Line Charts
  // CPU Load
  // Network Request Rate
  // kafka.network: type=RequestMetrics, name=RequestsPerSec
  // Network Error Rate
  // kafka.network: type=RequestMetrics, name=ErrorsPerSec
  // Bytes per broker/second
  // Bytes in per topic per second
  // Fetch Requests per Topic per second
  // Bytes per minute per broker
  // BytesInPerSec and BytesOutPerSec
  
  // Counter
  // Under-replicated Partitions - kafka_cluster_partition_underreplicated
  // kafka.server: type=ReplicaManager, name=UnderReplicatedPartitions
  // Offline Partition Count - kafka_controller_kafkacontroller_offlinepartitionscount
  // kafka.controller: type=KafkaController, name=OfflinePartitionsCount – Number of partitions without an active leader, therefore not readable nor writeable
  // Total Broker Partitions
  // kafka.server:type=ReplicaManager,name=PartitionCount – Number of partitions on this broker.
  // Active Controller count
  // Under Replicated partitions in Kafka topic
  // Records Lag
  // Alive Connections
  
  
  //Test Queries
  // Under-replicated Partitions - kafka_cluster_partition_underreplicated
  // Offline Partition Count - kafka_controller_kafkacontroller_offlinepartitionscount
  // Bytes In - kafka_server_brokertopicmetrics_bytesin_total
  // Bytes Out - kafka_server_brokertopicmetrics_bytesout_total
  // Network Error Rate - kafka_server_brokertopicmetrics_bytesout_total