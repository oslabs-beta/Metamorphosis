'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import MetricCard from '@/app/components/charts/MetricCard';
import LineGraph from '@/app/components/charts/LineGraph';
import Dropdown from '@/app/components/Dropdown';
import { getSocket } from '@/lib/utils/socket';
import { CardProp, GraphProp } from '@/types';

interface MetricData {
  kafka_controller_kafkacontroller_activebrokercount?: Array<{ value: string }>;
  kafka_controller_kafkacontroller_activecontrollercount?: Array<{ value: string }>;
  kafka_cluster_partition_underreplicated?: Array<{ value: string }>;
  kafka_controller_kafkacontroller_offlinepartitionscount?: Array<{ value: string }>;
  jvm_memory_bytes_used?: Array<{ output: { x: number[]; y: number[] } }>;
  kafka_server_brokertopicmetrics_bytesin_total?: Array<{ output: { x: number[]; y: number[] } }>;
  kafka_server_brokertopicmetrics_bytesout_total?: Array<{ output: { x: number[]; y: number[] } }>;
  kafka_network_requestmetrics_requestqueuetimems?: Array<{ output: { x: number[]; y: number[] } }>;
  kafka_network_requestmetrics_responsesendtimems?: Array<{ output: { x: number[]; y: number[] } }>;
}

const BrokerPage: React.FC = () => {
  const [actController, setActController] = useState<number | null>(null);
  const [actBroker, setActBroker] = useState<number | null>(null);
  const [underReplicatedCount, setUnderReplicatedCount] = useState<number | null>(null);
  const [offPartitions, setOffPartitions] = useState<number | null>(null);

  const [jvm, setJvm] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [totBytesIn, setTotBytesIn] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [totBytesOut, setTotBytesOut] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [reqQueue, setReqQueue] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [resSend, setResSend] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('data', (data: MetricData) => {
      const {
        kafka_controller_kafkacontroller_activebrokercount: activeBrokerCount,
        kafka_controller_kafkacontroller_activecontrollercount: activeControllerCount,
        kafka_cluster_partition_underreplicated: underReplicatedPartitions,
        kafka_controller_kafkacontroller_offlinepartitionscount: offlinePartitions,
        jvm_memory_bytes_used: jvmBytesUsed,
        kafka_server_brokertopicmetrics_bytesin_total: totalBytesIn,
        kafka_server_brokertopicmetrics_bytesout_total: totalBytesOut,
        kafka_network_requestmetrics_requestqueuetimems: requestQueueTimes,
        kafka_network_requestmetrics_responsesendtimems: responseSendTimes,
      } = data;

      if (activeControllerCount?.[0]?.value) {
        setActController(Number(activeControllerCount[0].value));
      }
      if (activeBrokerCount?.[0]?.value) {
        setActBroker(Number(activeBrokerCount[0].value));
      }
      if (underReplicatedPartitions) {
        const uRCount = underReplicatedPartitions.reduce((acc, obj) => {
          if (Number(obj.value) !== 0) acc++;
          return acc;
        }, 0);
        setUnderReplicatedCount(uRCount);
      }
      if (offlinePartitions?.[0]?.value) {
        setOffPartitions(Number(offlinePartitions[0].value));
      }
      if (jvmBytesUsed?.[0]?.output) {
        setJvm(jvmBytesUsed[0].output);
      }
      if (totalBytesIn?.[0]?.output) {
        setTotBytesIn(totalBytesIn[0].output);
      }
      if (totalBytesOut?.[0]?.output) {
        setTotBytesOut(totalBytesOut[0].output);
      }
      if (requestQueueTimes?.[0]?.output) {
        setReqQueue(requestQueueTimes[0].output);
      }
      if (responseSendTimes?.[0]?.output) {
        setResSend(responseSendTimes[0].output);
      }
    });

    socket.emit('range', '360');

    return () => {
      socket.disconnect();
    };
  }, []);

  const activeController: CardProp = {
    title: 'Active Controller',
    value: actController,
  };

  const activeBroker: CardProp = {
    title: 'Active Brokers',
    value: actBroker,
  };

  const underreplicated: CardProp = {
    title: 'Underreplicated Partitions',
    value: underReplicatedCount,
  };

  const offlinePartitionsCard: CardProp = {
    title: 'Offline Partitions Count',
    value: offPartitions,
  };

  const jvmUsed: GraphProp = {
    title: 'JVM Bytes Used',
    datapoints: jvm,
    color: 'rgba(191, 104, 149, 0.8)',
  };

  const tBytesIn: GraphProp = {
    title: 'Total Bytes In',
    datapoints: totBytesIn,
    color: 'rgba(7, 132, 200, 0.8)',
  };

  const tBytesOut: GraphProp = {
    title: 'Total Bytes Out',
    datapoints: totBytesOut,
    color: 'rgba(100, 200, 7, 0.8)',
  };

  const reqQueueTimes: GraphProp = {
    title: 'Request Queue Times',
    datapoints: reqQueue,
    color: 'rgba(234, 157, 73, 0.8)',
  };

  const resSendTimes: GraphProp = {
    title: 'Response Send Times',
    datapoints: resSend,
    color: 'rgba(116, 126, 234, 0.8)',
  };

  const items = [
    { id: 1, value: '15 Minutes' },
    { id: 2, value: '30 Minutes' },
    { id: 3, value: '60 Minutes' },
    { id: 4, value: '360 Minutes' },
  ];

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Overview</h1>
        <a href="/broker/metrics" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            View Detailed Broker Metrics
          </button>
        </a>
      </div>
      <Dropdown title="Select time interval" items={items} />
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <MetricCard data={activeBroker} normalVal={1000} />
        </Grid>
        <Grid item xs={3}>
          <MetricCard data={activeController} normalVal={1} />
        </Grid>
        <Grid item xs={3}>
          <MetricCard data={underreplicated} normalVal={0} />
        </Grid>
        <Grid item xs={3}>
          <MetricCard data={offlinePartitionsCard} normalVal={0} />
        </Grid>
        <Grid id="jvmUsed" item xs={4}>
          <LineGraph graphProps={jvmUsed} />
        </Grid>
        <Grid item xs={4}>
          <LineGraph graphProps={tBytesIn} />
        </Grid>
        <Grid item xs={4}>
          <LineGraph graphProps={tBytesOut} />
        </Grid>
        <Grid item xs={6}>
          <LineGraph graphProps={reqQueueTimes} />
        </Grid>
        <Grid item xs={6}>
          <LineGraph graphProps={resSendTimes} />
        </Grid>
      </Grid>
    </div>
  );
};

export default BrokerPage;

