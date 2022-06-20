const express = require('express');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const {query, queries} = require('./queries');
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

io.on('connection', socket => {
  console.log('client connected');  
  setInterval(query, 5000, socket);

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


