import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Connection from './ConnectionPage/Connection'
import Sidebar from './Sidebar/Sidebar';
import Broker from './BrokerDashboard/Broker';
import Login from './LoginPage/login'
import Consumer from './ConsumerDashboard/Consumer';
import Producer from './ProducerDashboard/Producer';



import main from './scss/main.scss';

const App = () => {

  const { isAuthenticated } = useAuth0();

  return (
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
  );
};

export default App;