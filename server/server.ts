import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import axios from'axios';
//this one when changed to import threw errors at me
const { query, query_chart, queries, queries_count, queries_chart, ipInCache } = require('./queries');
const { throttled_callTransport, messageCreator } = require('./nodemailer');

import { createServer } from 'http';
import { ServerError } from '../types';
import { Server } from 'socket.io';
import socket from '../client/socket';
const PORT = 3000;
const app = express(); 
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

interface ServerToClientEvents {
  data: (x: { [key: string]: Object}) => void;

}

interface ClientToServerEvents {
  range: (x: string) => void;
  ip: (x: string) => void;
  alert: (email: string, title: string, text: string) => void;
}

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



app.get('/', (req: Request, res: Response) => {
  console.log('connect')
  return res.status(200).sendFile(path.join(__dirname, '../dist/index.html'));
});

app.use('*', (req: Request,res: Response) => {
  res.status(404).send('Not Found - 404 handler in server.js');
});

app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
  console.log('err in server.js line 53', err);
  const defaultErr = {error: 'An error occur'};
  const errObj = Object.assign({}, defaultErr, err);
  console.log('errObj in global handler',errObj);
  res.status(500).json(errObj.error);
});

httpServer.listen(PORT, ()=>{
  console.log(`Server listening on port: ${PORT}`)
});


