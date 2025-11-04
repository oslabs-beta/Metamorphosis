'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TimelineChart from '@/app/components/BrokerMetrics/TimelineChart';
import { getSocket } from '@/lib/utils/socket';

interface BrokerMetricsData {
  jvm_heap_used?: Array<{ output: { x: number[]; y: number[] } }>;
  jvm_heap_max?: Array<{ output: { x: number[]; y: number[] } }>;
  jvm_gc_pause_time?: Array<{ output: { x: number[]; y: number[] } }>;
  jvm_thread_count?: Array<{ output: { x: number[]; y: number[] } }>;
  kafka_server_disk_read_bytes?: Array<{ output: { x: number[]; y: number[] } }>;
  kafka_server_disk_write_bytes?: Array<{ output: { x: number[]; y: number[] } }>;
  kafka_server_network_in_bytes?: Array<{ output: { x: number[]; y: number[] } }>;
  kafka_server_network_out_bytes?: Array<{ output: { x: number[]; y: number[] } }>;
}

const BrokerMetricsPage: React.FC = () => {
  const [selectedBroker, setSelectedBroker] = useState<string>('all');
  const [brokers, setBrokers] = useState<string[]>(['all']);
  
  // JVM Metrics
  const [heapUsed, setHeapUsed] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [heapMax, setHeapMax] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [gcPauseTime, setGcPauseTime] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [threadCount, setThreadCount] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  
  // Disk I/O Metrics
  const [diskReadBytes, setDiskReadBytes] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [diskWriteBytes, setDiskWriteBytes] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  
  // Network Metrics
  const [networkInBytes, setNetworkInBytes] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [networkOutBytes, setNetworkOutBytes] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('data', (data: BrokerMetricsData) => {
      // JVM Metrics
      if (data.jvm_heap_used?.[0]?.output) {
        setHeapUsed(data.jvm_heap_used[0].output);
      }
      if (data.jvm_heap_max?.[0]?.output) {
        setHeapMax(data.jvm_heap_max[0].output);
      }
      if (data.jvm_gc_pause_time?.[0]?.output) {
        setGcPauseTime(data.jvm_gc_pause_time[0].output);
      }
      if (data.jvm_thread_count?.[0]?.output) {
        setThreadCount(data.jvm_thread_count[0].output);
      }

      // Disk I/O Metrics
      if (data.kafka_server_disk_read_bytes?.[0]?.output) {
        setDiskReadBytes(data.kafka_server_disk_read_bytes[0].output);
      }
      if (data.kafka_server_disk_write_bytes?.[0]?.output) {
        setDiskWriteBytes(data.kafka_server_disk_write_bytes[0].output);
      }

      // Network Metrics
      if (data.kafka_server_network_in_bytes?.[0]?.output) {
        setNetworkInBytes(data.kafka_server_network_in_bytes[0].output);
      }
      if (data.kafka_server_network_out_bytes?.[0]?.output) {
        setNetworkOutBytes(data.kafka_server_network_out_bytes[0].output);
      }
    });

    socket.emit('range', '360');

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="dashboard" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Broker Resource Metrics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Monitor JVM, garbage collection, disk I/O, and network metrics per broker.
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Broker</InputLabel>
          <Select
            value={selectedBroker}
            label="Select Broker"
            onChange={(e) => setSelectedBroker(e.target.value)}
          >
            {brokers.map((broker) => (
              <MenuItem key={broker} value={broker}>
                {broker === 'all' ? 'All Brokers (Aggregated)' : `Broker ${broker}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* JVM Metrics Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          JVM Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TimelineChart
              title="Heap Used"
              data={heapUsed}
              color="rgba(191, 104, 149, 0.8)"
              unit="bytes"
            />
          </Grid>
          <Grid item xs={6}>
            <TimelineChart
              title="Heap Max"
              data={heapMax}
              color="rgba(234, 157, 73, 0.8)"
              unit="bytes"
            />
          </Grid>
          <Grid item xs={6}>
            <TimelineChart
              title="GC Pause Time"
              data={gcPauseTime}
              color="rgba(116, 126, 234, 0.8)"
              unit="ms"
            />
          </Grid>
          <Grid item xs={6}>
            <TimelineChart
              title="Thread Count"
              data={threadCount}
              color="rgba(100, 200, 7, 0.8)"
              unit="threads"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Disk I/O Metrics Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Disk I/O Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TimelineChart
              title="Disk Read Bytes"
              data={diskReadBytes}
              color="rgba(7, 132, 200, 0.8)"
              unit="bytes/sec"
            />
          </Grid>
          <Grid item xs={6}>
            <TimelineChart
              title="Disk Write Bytes"
              data={diskWriteBytes}
              color="rgba(200, 7, 132, 0.8)"
              unit="bytes/sec"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Network Metrics Section */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Network Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TimelineChart
              title="Network In Bytes"
              data={networkInBytes}
              color="rgba(100, 200, 7, 0.8)"
              unit="bytes/sec"
            />
          </Grid>
          <Grid item xs={6}>
            <TimelineChart
              title="Network Out Bytes"
              data={networkOutBytes}
              color="rgba(234, 157, 73, 0.8)"
              unit="bytes/sec"
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default BrokerMetricsPage;

