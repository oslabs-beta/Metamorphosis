const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const axios = require('axios');
const { query, query_chart, querires, queries_count, queries_chart, ipInCache } = require('./queries');
const app = express();
const PORT = 3000;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());


io.on('connection', socket => {
  console.log('client connected');  

  socket.on("range", range => {

    //passing down ip using closure in the queries.js file
    query_chart(socket, ip = ipInCache, range);
    
  })

  socket.on("ip", ip => {

    // for testing 
    query(socket,ip);

    // uncomment after test for normal use
    // setInterval(query, 5000, socket, ip);
  })
})

app.get('/', (req, res) => {
  console.log('connect')
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
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


