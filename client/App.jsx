import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Connection from './ConnectionPage/Connection'
import Sidebar from './Sidebar/Sidebar';
import Broker from './BrokerDashboard/Broker';
import Login from './LoginPage/login'
import Producer from './ProducerDashboard/Producer';
import Consumer from './ConsumerDashBoard/Consumer';


import main from './scss/main.scss';

const App = () => {

  let { isAuthenticated } = useAuth0();
  if(!process.env.LOCALMODE){isAuthenticated = true;}
  return (
    <>
    {
    process.env.LOCALMODE
    ?
    <Router>
      <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENTID}
      redirectUri={window.location.origin}
      >
      <Sidebar>
        <Routes>
          <Route path="/" element={<Login />}/> 
          <Route path="/connect" element={ <Connection/> }/>  
          <Route path="/broker" element={ <Broker/> }/> 
          <Route path="/producer" element={ <Producer /> }/> 
          <Route path="/consumer" element={ <Consumer /> }/> 
        </Routes>
      </Sidebar>
    </Auth0Provider>
      
    </Router>
    :
    <Router>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Connection/>}/> 
          <Route path="/connect" element={ <Connection/> }/>  
          <Route path="/broker" element={ <Broker/> }/> 
          <Route path="/producer" element={ <Producer /> }/> 
          <Route path="/consumer" element={ <Consumer /> }/> 
        </Routes>
      </Sidebar>
      
    </Router>
    }
    </>
  );
};

export default App;