import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import socket from "./socket"
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
    <>
    <label>Kafka IP:<input type="text" name="name" required/></label>
    <button onClick={connectIO}>connect</button>
     {/* <Router> */}
        {/* <nav className="navbar"> */}
            {/* <div className="navbar-links"></div> */}
        {/* </nav> */}
        {/* <Routes> */}
            {/* <Route path="/login" element={ <Login /> }/>  */}
            {/* <Route path="/journey" element={ <Journey /> }/>  */}
            {/* <Route path="/profile" element={ <Profile /> }/>  */}
            {/* <Route path="/*" element={<Landing />}/>  */}
            {/* error page */}
            {/* <Route path="*" element={<ErrorPage />}/>  */}
        {/* </Routes>  */}
    {/* </Router> */}
    </>


  )
}

export default App;
