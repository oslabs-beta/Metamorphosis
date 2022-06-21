import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import socket from "./socket"
import Connection from './ConnectionPage/Connection';
import Sidebar from './Sidebar/Sidebar';
// import Broker from './pages/Broker';
import Consumer from './pages/Consumer';
import Producer from './pages/Producer';
import Broker from './BrokerDashboard/Broker';
const App = () => {

  // const connectIO = () => {
  //   socket.connect();

  //   socket.on("data", (data)=>{
  //     console.log('incoming message: ',data)
  //   })

  // }

  return (
    <Router>
      <nav>
        <Sidebar />

      </nav>
      <Routes>
        <Route path="/" element={<Connection />}/> 
        <Route path="/broker" element={ <Broker/> }/>  
        <Route path="/producer" element={ <Producer /> }/> 
        <Route path="/consumer" element={ <Consumer /> }/> 

        {/* error page */}
        {/* <Route path="*" element={<ErrorPage />}/>  */}
      </Routes>
    </Router>


  );
}

export default App;
