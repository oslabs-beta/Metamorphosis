import React, { useState } from "react";

//data is the number value for the metric card
//normalVal needs to be passed into the MetricCard. If the value is greater than normalVal, render in red
const MetricCard = ({data, normalVal}) => {

    console.log('inMetric card', data<=normalVal);
    return (
        <div className="metric-card">
            <h1>{data.title}</h1>
            {data.value <= normalVal? <p >{data.value}</p>:<p style={{color:"#FF3D2E"}}>{data.value}</p>}
        </div>
    )
};

export default MetricCard;