import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Connection from './ConnectionPage/Connection'
import Sidebar from './Sidebar/Sidebar';
// import Broker from './pages/Broker';
import Consumer from './pages/Consumer';
import Producer from './pages/Producer';
import Broker from './BrokerDashboard/Broker';

let ip = '184.72.70.17:9090';
const App = () => {
  
  return (
    <Router>
      <nav className="navbar">
        <Sidebar />
      </nav>
      <Routes>
        <Route path="/" element={<Connection />}/> 
        {/* <Route path="/" element={ <Broker/> }/>   */}
        <Route path="/broker" element={ <Broker/> }/>  
        <Route path="/producer" element={ <Producer /> }/> 
        <Route path="/consumer" element={ <Consumer /> }/> 


      </Routes>
    </Router>

  )
}

export default App;
