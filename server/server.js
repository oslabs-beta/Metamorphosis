const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const axios = require('axios');
const { query, query_chart, queries, queries_count, queries_chart, ipInCache } = require('./queries');
const { throttled_callTransport } = require('./nodemailer');
import { createServer } from 'http';
import { ServerError } from '../types';
import { Server } from 'socket.io';
import socket from '../client/socket';
const app = express(); 
const httpServer = createServer(app);
const io = new Server(httpServer, {
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
    query_chart(socket, ipInCache, range);
    
    
  })

  socket.on("ip", ip => {

    // for testing 
    // query(socket,ip);
    //setTimeout(callTransporter, 3000, {to: 'sendFromMetricCard@yay.com', subject: 'FAKE Underreplicated Partitions'});
    
    // uncomment after test for normal use
    setInterval(query, 5000, socket, ip);
  })

  socket.on("alert", data => {
    throttled_callTransport(data);

  })
})

app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  console.log('connect')
  return res.status(200).sendFile(path.join(__dirname, '../dist/index.html'));
});

app.use('*', (req, res) => {
  res.status(404).send('Not Found - 404 handler in server.js');
});

app.use((err, req, res, next) => {
  console.log('err in server.js line 53', err);
  const defaultErr = {error: 'An error occur'};
  const errObj = Object.assign({}, defaultErr, err);
  console.log('errObj in global handler',errObj);
  res.status(500).json(errObj.error);
});

httpServer.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

