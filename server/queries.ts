// const axios = require('axios');

// const queries_count = {
//   // data come in as an array with metric.partition, metric.topic and each time point value at metric.value[1]
//   kafka_cluster_partition_insyncreplicascount:[],

//   // data come in as an array with metric.partition, metric.topic and each time point value at metric.value[1]
//   kafka_cluster_partition_underreplicated: [],
  
//   // data come in as an array with metric.partition, metric.topic and each time point value at metric.value[1]
//   kafka_controller_kafkacontroller_offlinepartitionscount: [],
  
//   // data come in as an array with metric.request and each time point value at metric.value[1]
//   kafka_network_requestmetrics_requestbytes_count: [],
//   kafka_controller_kafkacontroller_activebrokercount:[],
//   kafka_controller_kafkacontroller_activecontrollercount:[]
// }

// const queries_chart = {
//   kafka_server_brokertopicmetrics_bytesin_total: {},
//   kafka_server_brokertopicmetrics_bytesout_total: {},

//   // metric has a new key 'quantile' and an array with time point & value
//   kafka_controller_controllerstats_autoleaderbalancerateandtimems: {},
//   jvm_memory_bytes_used:{},
//   kafka_network_requestmetrics_requestqueuetimems:{},
//   kafka_network_requestmetrics_responsesendtimems:{},
//   kafka_server_brokertopicmetrics_totalproducerequests_total:{},
//   kafka_consumergroup_group_lag: {},
//   kafka_consumer_consumer_coordinator_metrics_rebalance_total: {},
//   kafka_producer_producer_metrics_io_ratio: {},
//   kafka_producer_producer_metrics_record_error_rate: {} 
// }

// let queries = {};
// let ipInCache = {ip: null};

// function query(socket, ip){
//   // temporarily rerout to local host to save AWS cost
//   // ip = 'localhost:9090';
//   ipInCache.ip = ip;

    
//   // these new key/value pairs to queries and emit it back to the frontend
//   // calling query_count and update the queries_count, then assign 
//   query_count(socket, ip);
//   query_chart(socket, ip);
// };

// function query_count(socket, ip){
//   console.log(ip)
//   for (const key of Object.keys(queries_count)) {
//     axios.get(`http://${ip}/api/v1/query`,{ 
//       params: {
//         query: key,
//       }})
//       .then(res =>{
//         // console.log('query_count/received data: ',res.data);
//         return res.data;
//       }) 
//       .then(res => {
//         // console.log('length of the data: ', res.data.result.length);
//         let retrieved_data = [];
//         res.data.result.forEach(x => {
//           const obj = {};
//           // this doesn't make too much sense to me since the structure can be different
//           // maybe send back obj.metric and obj.value? 
//           obj['instance'] = x.metric.instance;
//           obj['job'] = x.metric.job;
//           obj['partition'] = x.metric.partition? x.metric.partition: null;
//           obj['topic'] = x.metric.topic? x.metric.topic: null;
//           obj['request'] = x.metric.request? x.metric.request: null;
//           obj['value'] = x.value[1];
//           retrieved_data.push(obj);
//         });  
//         queries_count[key] = retrieved_data;
//         queries = {...queries_count, ...queries_chart};
//         socket.emit("data", queries);
//       })
//       .catch(err => console.log('queries.js line 71',err.code))
//   };
// };

// function query_chart(socket, ip = ipInCache, range = 15){
//   // for some reason I can get default ip, but it's the entire object of ipInCache
//   // I can't make it come in as ipinCache.ip 
//   // so the if statement is to make it into the correct string
//   if(ip instanceof Object){ip = ip.ip;}

//   // range from socket.io is a string, converting to a number and convert it from minutes to seconds
//   range = Number(range) * 60;

//   const endTime = Math. round((new Date()). getTime() / 1000);
//   let startTime = null;
//   let step = null;
  
//   // calculate endTime and step according to given range and give 15 time points for each query_range
//   // lookup table for steps: {15min/900s: 60s, 30min/1800s: 120s, 60min/3600s: 240s, 360min/21600s: 1440s}
//   switch(range){
//     case 900:
//       startTime = endTime - 900;
//       step =  60;
//       break;
//     case 1800:
//       startTime = endTime - 1800;
//       step = 120;
//       break;
//     case 3600:
//       startTime = endTime - 3600;
//       step = 240;
//       break;
//     case 21600:
//       startTime = endTime - 21600;
//       step = 1440;
//   };


//   for (const key of Object.keys(queries_chart)) {
//     console.log(key, startTime, endTime, step);
//     axios.get(`http://${ip}/api/v1/query_range`,{ 
//       params: {
//         query: key,
//         start: startTime,
//         end: endTime,
//         step: step,
//       }})
//       .then(res =>{
//         // console.log('query_count/received data: ',res.data);
//         return res.data;
//       }) 
//       .then(res => {
//         let retrieved_data = [];
//         res.data.result.forEach(el => {
//           const obj = {};
//           // same question as in query_count, only grabbing metrics for now
//           obj['metric'] = el.metric;
//           obj['output'] = {x:[], y:[]};
//           for (let i = 0; i < el.values.length; i++){
//             obj['output']['x'].push(el.values[i][0]);
//             obj['output']['y'].push(Number(el.values[i][1]));
//           } 
//           // console.log('obj structure', obj)
//           retrieved_data.push(obj);
//         });  
//         queries_chart[key] = retrieved_data;
//         queries = {...queries_count, ...queries_chart};
//         socket.emit("data", queries);
//       })
//       .catch(err => console.log(err.code))
//   };
// };

const axios = require('axios');

interface QueriesCount {
  kafka_cluster_partition_insyncreplicascount: Array<number>,
  kafka_cluster_partition_underreplicated: Array<number>,
  kafka_controller_kafkacontroller_offlinepartitionscount: Array<number>,
  kafka_network_requestmetrics_requestbytes_count: Array<number>,
  kafka_controller_kafkacontroller_activebrokercount: Array<number>,
  kafka_controller_kafkacontroller_activecontrollercount: Array<number>,
}

const queries_count: QueriesCount = {
  // data come in as an array with metric.partition, metric.topic and each time point value at metric.value[1]
  kafka_cluster_partition_insyncreplicascount:[],

  // data come in as an array with metric.partition, metric.topic and each time point value at metric.value[1]
  kafka_cluster_partition_underreplicated: [],
  
  // data come in as an array with metric.partition, metric.topic and each time point value at metric.value[1]
  kafka_controller_kafkacontroller_offlinepartitionscount: [],
  
  // data come in as an array with metric.request and each time point value at metric.value[1]
  kafka_network_requestmetrics_requestbytes_count: [],
  kafka_controller_kafkacontroller_activebrokercount:[],
  kafka_controller_kafkacontroller_activecontrollercount:[]
}

interface QueriesChart {
  kafka_server_brokertopicmetrics_bytesin_total: Object,
  kafka_server_brokertopicmetrics_bytesout_total: Object,
  kafka_controller_controllerstats_autoleaderbalancerateandtimems: Object,
  jvm_memory_bytes_used: Object,
  kafka_network_requestmetrics_requestqueuetimems: Object,
  kafka_network_requestmetrics_responsesendtimems: Object,
  kafka_server_brokertopicmetrics_totalproducerequests_total: Object,
  kafka_consumergroup_group_lag: Object,
  kafka_consumer_consumer_coordinator_metrics_rebalance_total: Object,
  kafka_producer_producer_metrics_io_ratio: Object,
  kafka_producer_producer_metrics_record_error_rate: Object 
}

const queries_chart: QueriesChart = {
  kafka_server_brokertopicmetrics_bytesin_total: {},
  kafka_server_brokertopicmetrics_bytesout_total: {},

  // metric has a new key 'quantile' and an array with time point & value
  kafka_controller_controllerstats_autoleaderbalancerateandtimems: {},
  jvm_memory_bytes_used:{},
  kafka_network_requestmetrics_requestqueuetimems:{},
  kafka_network_requestmetrics_responsesendtimems:{},
  kafka_server_brokertopicmetrics_totalproducerequests_total:{},
  kafka_consumergroup_group_lag: {},
  kafka_consumer_consumer_coordinator_metrics_rebalance_total: {},
  kafka_producer_producer_metrics_io_ratio: {},
  kafka_producer_producer_metrics_record_error_rate: {} 
}

let queries = {};
let ipInCache = {ip: 'Placeholder'};

function query(socket: any, ip: string){
  // temporarily rerout to local host to save AWS cost
  // ip = 'localhost:9090';
  ipInCache.ip = ip;

    
  // these new key/value pairs to queries and emit it back to the frontend
  // calling query_count and update the queries_count, then assign 
  query_count(socket, ip);
  query_chart(socket, ip);
};

function query_count(socket: any, ip: string) {
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
        let retrieved_data : Object[] = [];
        type metrics = {
          instance?: any,
          job?: any,
          partition?: any,
          topic?: any,
          request?: any, 
          value?: any
        } 
        res.data.result.forEach((x: any) => {
          const obj: metrics = {};
          // this doesn't make too much sense to me since the structure can be different
          // maybe send back obj.metric and obj.value? 
          obj.instance = x.metric.instance;
          obj.job = x.metric.job;
          obj.partition = x.metric.partition? x.metric.partition: null;
          obj.topic = x.metric.topic? x.metric.topic: null;
          obj.request = x.metric.request? x.metric.request: null;
          obj.value = x.value[1];
          retrieved_data.push(obj);
        });  
        queries_count[key] = retrieved_data;
        queries = {...queries_count, ...queries_chart};
        socket.emit("data", queries);
      })
      .catch(err => console.log('queries.js line 71',err.code))
  };
};

function query_chart(socket: any, ip: any = ipInCache, range: number = 15) {
  // for some reason I can get default ip, but it's the entire object of ipInCache
  // I can't make it come in as ipinCache.ip 
  // so the if statement is to make it into the correct string
  if(ip instanceof Object){ip = ip.ip;}

  // range from socket.io is a string, converting to a number and convert it from minutes to seconds
  range = Number(range) * 60;

  const endTime = Math. round((new Date()). getTime() / 1000);
  let startTime;
  let step;
  
  // calculate endTime and step according to given range and give 15 time points for each query_range
  // lookup table for steps: {15min/900s: 60s, 30min/1800s: 120s, 60min/3600s: 240s, 360min/21600s: 1440s}
  switch(range){
    case 900:
      startTime = endTime - 900;
      step =  60;
      break;
    case 1800:
      startTime = endTime - 1800;
      step = 120;
      break;
    case 3600:
      startTime = endTime - 3600;
      step = 240;
      break;
    case 21600:
      startTime = endTime - 21600;
      step = 1440;
  };


  for (const key of Object.keys(queries_chart)) {
    console.log(key, startTime, endTime, step);
    axios.get(`http://${ip}/api/v1/query_range`,{ 
      params: {
        query: key,
        start: startTime,
        end: endTime,
        step: step,
      }})
      .then(res =>{
        // console.log('query_count/received data: ',res.data);
        return res.data;
      }) 
      .then(res => {
        let retrieved_data : Object[] = [];
        res.data.result.forEach(el => {
          const obj = {};
          // same question as in query_count, only grabbing metrics for now
          obj['metric'] = el.metric;
          obj['output'] = {x:[], y:[]};
          for (let i = 0; i < el.values.length; i++){
            obj['output']['x'].push(el.values[i][0]);
            obj['output']['y'].push(Number(el.values[i][1]));
          } 
          // console.log('obj structure', obj)
          retrieved_data.push(obj);
        });  
        queries_chart[key] = retrieved_data;
        queries = {...queries_count, ...queries_chart};
        socket.emit("data", queries);
      })
      .catch(err => console.log(err.code))
  };
};

module.exports = {query, query_chart, queries, queries_count, queries_chart, ipInCache};