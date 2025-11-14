'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import ConsumerLagHeatmap from '@/app/components/charts/ConsumerLagHeatmap';
import { PartitionLag } from '@/types';

const ConsumerLagPage: React.FC = () => {
  const [consumerGroups, setConsumerGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [lagData, setLagData] = useState<PartitionLag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConsumerGroups();
  }, []);

  const fetchConsumerGroups = async () => {
    try {
      // Get brokers from localStorage or environment
      const brokers = localStorage.getItem('kafkaBrokers') || 'localhost:9092';
      
      const response = await fetch(
        `/api/metrics/consumer-lag?brokers=${encodeURIComponent(brokers)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch consumer groups');
      }

      const data = await response.json();
      setConsumerGroups(data.groups || []);
    } catch (err: any) {
      console.error('Error fetching consumer groups:', err);
      setError(err.message || 'Failed to fetch consumer groups');
    }
  };

  const fetchLagData = async () => {
    if (!selectedGroup) return;

    setLoading(true);
    setError(null);

    try {
      const brokers = localStorage.getItem('kafkaBrokers') || 'localhost:9092';
      
      const response = await fetch(
        `/api/metrics/consumer-lag?brokers=${encodeURIComponent(brokers)}&groupId=${encodeURIComponent(selectedGroup)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch consumer lag data');
      }

      const data = await response.json();
      setLagData(data.lagData || []);
    } catch (err: any) {
      console.error('Error fetching lag data:', err);
      setError(err.message || 'Failed to fetch lag data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      fetchLagData();
      // Refresh lag data every 10 seconds
      const interval = setInterval(fetchLagData, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Consumer Lag Heatmap
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Monitor consumer lag per partition to identify bottlenecks and ensure real-time processing.
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Consumer Group</InputLabel>
            <Select
              value={selectedGroup}
              label="Consumer Group"
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              {consumerGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={fetchConsumerGroups}
            disabled={loading}
          >
            Refresh Groups
          </Button>

          {selectedGroup && (
            <Button
              variant="outlined"
              onClick={fetchLagData}
              disabled={loading}
            >
              Refresh Lag Data
            </Button>
          )}
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && lagData.length > 0 && (
        <ConsumerLagHeatmap lagData={lagData} consumerGroup={selectedGroup} />
      )}

      {!loading && !selectedGroup && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Please select a consumer group to view lag data.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ConsumerLagPage;

