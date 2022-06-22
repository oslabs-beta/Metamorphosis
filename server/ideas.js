const axios = require('axios');
//ipaddress, port, xinterval
const queries_count = {
  kafka_cluster_partition_insyncreplicascount:[],
  kafka_cluster_partition_underreplicated: [],
  kafka_controller_kafkacontroller_offlinepartitionscount: [],
  kafka_network_requestmetrics_requestbytes_count: []
}
const queries_chart = {
  kafka_server_brokertopicmetrics_bytesin_total: {},
  kafka_server_brokertopicmetrics_bytesout_total: {},
}

// type: count || chart
function query(socket, type, ip = 'localhost:9090'){
  switch(type){
    case 'count':
        for (const [key, value] of Object.entries(queries_count)) {
        axios.get(`http://${ip}/api/v1/query`,{ 
          params: {
            query: key,
          }})
          .then(res =>{
            // console.log(res.data);
            return res.data;
          }) 
          .then(res => {
            for (let i = 0; i < res.data.result.length; i++) {
              let res = [];
              res.data.result.forEach(x => {
                const obj = new Map();
                obj.set(x.metric.instance,x.value[1]);
                res.push(obj);
              });  
              queries_count[key] = res;
            }
            socket.emit("queries_count", queries_count);
          })
          .catch(err => console.log(err.code))
        };
    case('chart'):
     // receiving json {currentTime: unixTimeString, interval: 15}, parse the data
     // lookup table for steps: {15min: 60s, 30min: 120s, 60min: 240s, 360min: 1440s}
     // set a default interval

     // labels: x data: y 
     for (const [key, value] of Object.entries(queries_chart)) {
      axios.get(`http://${ip}/api/v1/query_range`,{ 
        params: {
          query: key,
          start: 'calculate from input time',
          end:'inputTime',
          step: 'check lookup table',
        }})
        .then(res =>{
          // console.log(res.data);
          return res.data;
        }) 
        .then(res => {
          const output = {
            x: [],
            y: []
          };
          for (let i = 0; i < res.data.result.length; i++) {
            output.x.push(res.data.result[i].value[0]);   //  x values
            output.y.push(Number(res.data.result[i].value[1]));  // y values
          }
          queries_chart[key] = output;  
          // console.log('after updating', queries)
          socket.emit("queries_chart", queries_chart);
        })
        .catch(err => console.log(err.code))
      }
    };
  }

  
  
  module.exports = {query, queries};
  
  