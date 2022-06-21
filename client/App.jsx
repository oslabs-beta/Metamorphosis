import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import socket from "./socket";
import Connection from './ConnectionPage/Connection';
import Sidebar from './Sidebar/Sidebar';
// import Broker from './pages/Broker';
import Consumer from './pages/Consumer';
import Producer from './pages/Producer';
import Broker from './BrokerDashboard/Broker';

let ip = '184.72.70.17:9090';
const App = () => {

  const connectIO = () => {
    socket.connect(); 
    socket.on("data", (data)=>{
      console.log('incoming message: ',data)
    })
    socket.emit("ip", ip);
  }
  
  return (
    <Router>
      <nav>
        <Sidebar />
        <label>Kafka IP:<input type="text" name="name" required/></label>
        <button onClick={connectIO}>connect</button>
      </nav>
      <Routes>
        <Route path="/" element={<Connection />}/> 
        <Route path="/broker" element={ <Broker/> }/>  
        <Route path="/producer" element={ <Producer /> }/> 
        <Route path="/consumer" element={ <Consumer /> }/> 


      </Routes>
    </Router>

  )
}

export default App;
