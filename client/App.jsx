import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Connection from './ConnectionPage/Connection'
import Sidebar from './Sidebar/Sidebar';
// import Broker from './pages/Broker';
import Consumer from './pages/Consumer';
import Producer from './pages/Producer';
import Broker from './BrokerDashboard/Broker';

import main from './scss/main.scss';
import { SocketProvider } from './socket';

const App = () => {
  return (
    // <SocketProvider>
      <Router>
        <Sidebar>
        <Routes>
          <Route path="/" element={<Connection />}/> 
          {/* <Route path="/" element={ <Broker/> }/>   */}
          <Route path="/broker" element={ <Broker/> }/>  
          <Route path="/producer" element={ <Producer /> }/> 
          <Route path="/consumer" element={ <Consumer /> }/> 
        </Routes>
        </Sidebar>
      </Router>
    // </SocketProvider>

  );
};

export default App;