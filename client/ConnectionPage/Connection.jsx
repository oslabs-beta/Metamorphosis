import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectAddress, selectIpaddress } from '../reducers/connectSlice';
import socket from '../socket';
// import { SocketContext } from '../socket';

const Connection = () => {
  
  const dispatch = useDispatch();
  const ip = useSelector(selectIpaddress);
  // const socket = useContext(SocketContext);
  
  //set state of connection form
  const [connection, setConnection] = useState({
      ipaddress: '',
      port: ''
  })

  //form validation error 
  const [ipError, setIpError] = useState(false);
  const [portError, setPortError] = useState(false);
  const [connectError, setConnectError] = useState(false);
  

  //valid ip address check
  const isIP = (str) => {
    console.log(typeof str);
    console.log('inisIp', str)
    const block = str.split(".");
    if (block.length === 4){
      return block.every(el => {
        return parseInt(el,10) >=0 && parseInt(el,10) <= 255;
      })
    } else if (block == 'localhost' && !process.env.LOCALMODE){
      return block;
    }
    return false;
  }

  //valid port number sort
  const isPort = (str) => {
    return parseInt(str) >=1 && parseInt(str) <=65535
  }

  //On change handler for form inputs
  const onConnect = e => {
    const { name, value } = e.target;

    setConnection({
      ...connection,
      [ name ]: value
    })

    setIpError(false);
    setPortError(false);
  }

  //handle click function for form inputs
  const handleConnect = e => {
    e.preventDefault();

    const { ipaddress, port } = connection;

    //checks if ip address & ports are valid
    if (!isIP(ipaddress)){
      setIpError(true);
    } else if (!isPort(port)){
      setPortError(true);
    } else {         
        socket.connect(); 

        // socket.on("queries_chart", (queries_chart)=>{
        //   if(queries_chart) dispatch(connectAddress({ipaddress, port}));
        //   console.log('incoming message: ',queries_chart)
        // });

        socket.on("data", (data)=>{
          if(data) dispatch(connectAddress({ipaddress, port}));
        });
        socket.emit("ip", `${ipaddress}:${port}`);



    }
    
    //reset form data
    setConnection({
      ipaddress:'',
      port:''
    })
  }

  return (
    <div className="connect">
      
      {!ip?
      <div className="home-form">
        <form className="connect-form" onSubmit={handleConnect}>
          <div className="connect-inputs">
            <label htmlFor="ipaddress" className="ip-label">IP Address: </label>
            <input 
                id="ipaddress"
                type="text" 
                name="ipaddress" 
                className="ip-input" 
                placeholder="Enter your IP address"                        
                value={connection.ipaddress}
                onChange={onConnect}
            />
          </div>

          <div className="connect-inputs">
            <label htmlFor="port" className="port-label">PORT: </label>
            <input 
                id="port"
                type="text" 
                name="port" 
                className="port-input" 
                placeholder="Enter your PORT"
                value={connection.port}
                onChange={onConnect}
            />
          </div>
          <div className="form-input-btn">
            <button id="connectBtnConnection" className="connect-form-btn" type="submit">Connect</button>
          </div>
          {(ipError && portError)? <p className="Error" style={{color:"#FF3D2E"}}>Invalid IP Address and PORT</p>
          : ipError? <p className="Error" style={{color:"#FF3D2E"}}>Invalid IP Address</p>
          : portError? <p className="Error" style={{color:"#FF3D2E"}}>Invalid PORT</p> 
          : connectError? <p className="Error" style={{color:"#FF3D2E"}}>Unable to connect</p>
          : null
          }
      </form>
    </div>
    : 
    <div className="form-input-btn">
      <button className="connect-form-btn" type="submit">Disconnect</button>
    </div>}
    </div>
    )
}

export default Connection;