import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import io from 'socket.io-client';
import socket from "../../socket";
//data is the number value for the metric card
//normalVal needs to be passed into the MetricCard. If the value is greater than normalVal, render in red


const MetricCard = ({data, normalVal}) => {
  const { user } = useAuth0();

    if(data.value > normalVal){
        socket.emit('alert', {to: user.email, subject: data.title});
    }
   
    return (
        <div className="metric-card">
            {data.value <= normalVal? <p id={(data.title).split(' ').join('')} className="metric-title">{data.title}</p>: <p className="metric-title-over">{data.title}</p>}
            {data.value <= normalVal? <p id={(data.title).split(' ').join('')+"Value"} className="metric-val">{data.value}</p>:<p className="metric-over-norm">{data.value}</p>}
        </div>
    )
};

export default MetricCard;
