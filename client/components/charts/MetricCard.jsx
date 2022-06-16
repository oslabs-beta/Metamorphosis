import React, { useState } from "react";

//data is the number value for the metric card
//normalVal needs to be passed into the MetricCard. If the value is greater than normalVal, render in red
const MetricCard = ({data, normalVal}) => {

    return (
        <div>
            <h1>Metric</h1>
            {data <= normalVal? <p >data</p>:<p style={{color:"#FF3D2E"}}>data</p>}
        </div>
    )
};

export default MetricCard;