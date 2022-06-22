import React, { useState } from "react";

//data is the number value for the metric card
//normalVal needs to be passed into the MetricCard. If the value is greater than normalVal, render in red
const MetricCard = ({data, normalVal}) => {

    console.log('inMetric card', data<=normalVal);
    return (
        <div className="metric-card">
            {data.value <= normalVal? <p className="metric-title">{data.title}</p>: <p className="metric-title-over">{data.title}</p>}
            {data.value <= normalVal? <p className="metric-val">{data.value}</p>:<p className="metric-over-norm">{data.value}</p>}
        </div>
    )
};

export default MetricCard;