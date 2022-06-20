const axios = require('axios');

const queries = {
  kafka_cluster_partition_underreplicated: [],
  kafka_controller_kafkacontroller_offlinepartitionscount: [],
  kafka_server_brokertopicmetrics_bytesin_total: [],
  kafka_server_brokertopicmetrics_bytesout_total: [],
  kafka_server_brokertopicmetrics_bytesout_total: []
}

function query(socket){
  let query_val;
  for (const [key, value] of Object.entries(queries)) {
    query_val = key;
    axios.get('http://localhost:9090/api/v1/query',{ 
      params: {
        query: key,
      }})
      .then(res =>res.data) 
      .then(res => {
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

        for (let i = 0; i < res.data.result.length; i++) {
          queries[key].push({
            x: res.data.result[i].value[0],
            y: res.data.result[i].value[1]
          });
        }
        
        console.log('after updating', queries)
        socket.emit("data", queries);
      })
      .catch(err => console.log(err.code))
    }
  };
  
  module.exports = {query, queries};
  
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