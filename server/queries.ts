const axios = require('axios');

interface QueriesCount {
  kafka_cluster_partition_insyncreplicascount: Array<Object>, 
  kafka_cluster_partition_underreplicated: Array<Object>,
  kafka_controller_kafkacontroller_offlinepartitionscount: Array<Object>,
  kafka_network_requestmetrics_requestbytes_count: Array<Object>,
  kafka_controller_kafkacontroller_activebrokercount: Array<Object>,
  kafka_controller_kafkacontroller_activecontrollercount: Array<Object>,
}

const queries_count: QueriesCount = {
  kafka_cluster_partition_insyncreplicascount:[],
  kafka_cluster_partition_underreplicated: [],
  kafka_controller_kafkacontroller_offlinepartitionscount: [],
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
  kafka_producer_producer_metrics_record_error_rate: Object,
}

const queries_chart: QueriesChart = {
  kafka_server_brokertopicmetrics_bytesin_total: {},
  kafka_server_brokertopicmetrics_bytesout_total: {},
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
  ipInCache.ip = ip;
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
      .then((res: any) =>{
        return res.data;
      }) 
      .then((res: any) => {
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
          obj.instance = x.metric.instance;
          obj.job = x.metric.job;
          obj.partition = x.metric.partition? x.metric.partition: null;
          obj.topic = x.metric.topic? x.metric.topic: null;
          obj.request = x.metric.request? x.metric.request: null;
          obj.value = x.value[1];
          retrieved_data.push(obj);
        });  
        queries_count[key as keyof QueriesCount] = retrieved_data;
        queries = {...queries_count, ...queries_chart};
        socket.emit("data", queries);
      })
      .catch((err: any) => console.log('queries.js line 71',err.code))
  };
};

function query_chart(socket: any, ip: any = ipInCache, range: number = 15) {
  if(ip instanceof Object){ip = ip.ip;}
  range = Number(range) * 60;
  const endTime = Math. round((new Date()). getTime() / 1000);
  let startTime;
  let step;
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
      .then((res: any) =>{
        return res.data;
      }) 
      .then((res: any) => {
        let retrieved_data : Object[] = [];
        const obj = {
          metric: '',
          output: {
            x: [1],
            y: [1]
          }
        };
        res.data.result.forEach((el:any) => { 
          obj.metric = el.metric;
          obj.output = {x:[], y:[]};
          for (let i = 0; i < el.values.length; i++){
            obj['output']['x'].push(el.values[i][0]);
            obj['output']['y'].push(Number(el.values[i][1]));
          } 
          retrieved_data.push(obj);
        });  
        queries_chart[key as keyof QueriesChart] = retrieved_data; 
        queries = {...queries_count, ...queries_chart};
        socket.emit("data", queries);
      })
      .catch((err: any) => console.log(err.code))
  };
};

module.exports = {query, query_chart, queries, queries_count, queries_chart, ipInCache};