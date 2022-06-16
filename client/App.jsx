import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const App = () => {


  return (
    <Router>
        <nav className="navbar">
            <div className="navbar-links"></div>
        </nav>
        <Routes>
            {/* <Route path="/login" element={ <Login /> }/> 
            <Route path="/journey" element={ <Journey /> }/> 
            <Route path="/profile" element={ <Profile /> }/> */}
            {/* <Route path="/*" element={<Landing />}/>  */}
            {/* error page */}
            {/* <Route path="*" element={<ErrorPage />}/>  */}
        </Routes>
    </Router>


  );
}

export default App;
