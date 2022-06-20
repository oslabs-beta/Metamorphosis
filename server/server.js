const express = require('express');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

//what metrics do we need and how often do we have to pull it from Prometheus?

io.on('connection', socket => {
  console.log('client connected');  
  
  let data;
  
  function test(){
    axios.get('http://localhost:9090/api/v1/query',{ 
      params: {
        query: 'kafka_controller_controllerstats_autoleaderbalancerateandtimems'
      }})
    .then(res => res.data)
    .then(res => {
      const array = [];
      res.data.result.forEach(x=>array.push(x.value));
      data = array;
      socket.emit("kafka_controller_controllerstats_autoleaderbalancerateandtimems", 
      data);
    })
    .catch(err => console.log(err.code))
  }
  setInterval(test, 5000);
})


app.get('/', (req, res) => {
  console.log('connect')
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/api/test', (req, res) => {
  console.log('receiving get request from the frontend');
  return res.status(200).json('get request worked');
});


app.use('*', (req,res) => {
  res.status(404).send('Not Found - 404 handler in server.js');
});

app.use((err, req, res, next) => {
  console.log(err);
  const defaultErr = {error: 'An error occur'};
  const errObj = Object.assign({}, defaultErr, err);
  console.log('errObj in global handler',errObj);
  res.status(500).json(errObj.error);
});

httpServer.listen(PORT, ()=>{
  console.log(`Server listening on port: ${PORT}`)
});


