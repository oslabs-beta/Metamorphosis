'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import LineGraph from '@/app/components/charts/LineGraph';
import { getSocket } from '@/lib/utils/socket';
import { GraphProp } from '@/types';

interface ProducerData {
  kafka_producer_producer_metrics_io_ratio?: Array<{ output: { x: number[]; y: number[] } }>;
  kafka_producer_producer_metrics_record_error_rate?: Array<{ output: { x: number[]; y: number[] } }>;
}

const ProducerPage: React.FC = () => {
  const [ioRatio, setIoRatio] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [recErr, setRecErr] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('data', (data: ProducerData) => {
      const {
        kafka_producer_producer_metrics_io_ratio: ioRat,
        kafka_producer_producer_metrics_record_error_rate: recErrRate,
      } = data;

      if (ioRat?.[0]?.output) {
        setIoRatio(ioRat[0].output);
      }
      if (recErrRate?.[0]?.output) {
        setRecErr(recErrRate[0].output);
      }
    });

    socket.emit('range', '360');

    return () => {
      socket.disconnect();
    };
  }, []);

  const ioR: GraphProp = {
    title: 'i/o Ratio',
    datapoints: ioRatio,
    color: 'rgba(234, 157, 73, 0.8)',
  };

  const recErrorRate: GraphProp = {
    title: 'Record Error Rate',
    datapoints: recErr,
    color: 'rgba(116, 126, 234, 0.8)',
  };

  return (
    <div className="dashboard">
      <h1>Producer Dashboard</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <LineGraph graphProps={ioR} />
        </Grid>
        <Grid item xs={6}>
          <LineGraph graphProps={recErrorRate} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ProducerPage;

