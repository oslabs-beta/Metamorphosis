import React, { useContext, useEffect, useState, ChangeEvent, FormEvent } from "react";
import { render } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { connectAddress, selectIpaddress } from '../reducers/connectSlice';
import socket from '../socket';
// import { SocketContext } from '../socket';

const Connection = ():JSX.Element => {
  const dispatch = useDispatch();  // TS: By default, the return value of useDispatch is the standard Dispatch type defined by the Redux core types, so no declarations are needed
  const ip = useSelector(selectIpaddress);
  // const socket = useContext(SocketContext);
  
  //set state of connection form -------------------------------------
  interface ConnectionType {
    ipaddress: string,
    port: string
  }

  const [connection, setConnection] = useState<ConnectionType>({
      ipaddress: '',
      port: ''
  });

  //form validation error  ------------------------------------------
  const [ipError, setIpError] = useState<boolean>(false);
  const [portError, setPortError] = useState<boolean>(false);
  const [connectError, setConnectError] = useState<boolean>(false);
  
  //valid ip address check ------------------------------------------
  const isIP = (str: string): boolean => {
    console.log(typeof str);
    console.log('inisIp', str)
    const block: string[] = str.split(".");
    if (block.length === 4){
      return block.every(el => {
        return parseInt(el,10) >=0 && parseInt(el,10) <= 255;
      })
    }
    return false;
  }

  //valid port number sort------------------------------------------
  const isPort = (str: string):boolean => {
    return parseInt(str) >=1 && parseInt(str) <=65535
  }

  //On change handler for form inputs--------------------------------
  const onConnect = (e: ChangeEvent<HTMLInputElement>) => {

    const { target } = e;
    const { name, value } : { name: string, value: string } = target as HTMLButtonElement;

    setConnection({
      ...connection,
      [ name ]: value
    })

    setIpError(false);
    setPortError(false);
  }

  //handle click function for form inputs-----------------------------
  const handleConnect = (e: FormEvent) => {
    e.preventDefault();

    const { ipaddress, port } : { ipaddress : string, port : string } = connection;

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

      socket.on("data", (data: string)=>{
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
    <div className="home">
      
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
            <button className="connect-form-btn" type="submit">Connect</button>
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