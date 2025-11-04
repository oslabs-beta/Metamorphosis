'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import LineGraph from '@/app/components/charts/LineGraph';
import { getSocket } from '@/lib/utils/socket';
import { GraphProp } from '@/types';

interface ConsumerData {
  kafka_consumergroup_group_lag?: Array<{ output: { x: number[]; y: number[] } }>;
  kafka_consumer_consumer_coordinator_metrics_rebalance_total?: Array<{ output: { x: number[]; y: number[] } }>;
}

const ConsumerPage: React.FC = () => {
  const [lag, setLag] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [rebalance, setRebalance] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('data', (data: ConsumerData) => {
      const {
        kafka_consumergroup_group_lag: groupL,
        kafka_consumer_consumer_coordinator_metrics_rebalance_total: rebTot,
      } = data;

      if (groupL?.[0]?.output) {
        setLag(groupL[0].output);
      }
      if (rebTot?.[0]?.output) {
        setRebalance(rebTot[0].output);
      }
    });

    socket.emit('range', '360');

    return () => {
      socket.disconnect();
    };
  }, []);

  const gl: GraphProp = {
    title: 'Group Lag',
    datapoints: lag,
    color: 'rgba(234, 157, 73, 0.8)',
  };

  const rt: GraphProp = {
    title: 'Rebalance Total',
    datapoints: rebalance,
    color: 'rgba(116, 126, 234, 0.8)',
  };

  return (
    <div className="dashboard">
      <h1>Consumer Dashboard</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <LineGraph graphProps={gl} />
        </Grid>
        <Grid item xs={6}>
          <LineGraph graphProps={rt} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ConsumerPage;

