import React, { useState } from "react";
import io from 'socket.io-client';
import socket from "../../socket";
//data is the number value for the metric card
//normalVal needs to be passed into the MetricCard. If the value is greater than normalVal, render in red


const MetricCard = ({data, normalVal}) => {

    console.log('inMetric card', data<=normalVal);
    if(data.value > normalVal){
        socket.emit('alert', {to: 'chrisxesq@gmail.com', subject: data.title});
    }
   
    return (
        <div className="metric-card">
            {data.value <= normalVal? <p className="metric-title">{data.title}</p>: <p className="metric-title-over">{data.title}</p>}
            {data.value <= normalVal? <p className="metric-val">{data.value}</p>:<p className="metric-over-norm">{data.value}</p>}
        </div>
    )
};

export default MetricCard;