'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { PartitionLag } from '@/types';

interface ConsumerLagHeatmapProps {
  lagData: PartitionLag[];
  consumerGroup?: string;
}

const ConsumerLagHeatmap: React.FC<ConsumerLagHeatmapProps> = ({ lagData, consumerGroup }) => {
  const getLagColor = (lag: number): string => {
    if (lag === 0) return '#4caf50'; // Green
    if (lag < 1000) return '#8bc34a'; // Light green
    if (lag < 10000) return '#ffc107'; // Yellow
    if (lag < 100000) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const getLagSeverity = (lag: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (lag === 0) return 'low';
    if (lag < 1000) return 'low';
    if (lag < 10000) return 'medium';
    if (lag < 100000) return 'high';
    return 'critical';
  };

  // Group lag data by topic
  const topicGroups = lagData.reduce((acc, item) => {
    if (!acc[item.topic]) {
      acc[item.topic] = [];
    }
    acc[item.topic].push(item);
    return acc;
  }, {} as Record<string, PartitionLag[]>);

  // Sort partitions within each topic
  Object.keys(topicGroups).forEach((topic) => {
    topicGroups[topic].sort((a, b) => a.partition - b.partition);
  });

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {consumerGroup && (
        <Typography variant="h6" gutterBottom>
          Consumer Group: {consumerGroup}
        </Typography>
      )}
      
      {Object.entries(topicGroups).map(([topic, partitions]) => (
        <Paper key={topic} sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Topic: {topic}
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Partition</TableCell>
                  <TableCell align="right">Committed Offset</TableCell>
                  <TableCell align="right">End Offset</TableCell>
                  <TableCell align="right">Lag</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partitions.map((item) => {
                  const severity = getLagSeverity(item.lag);
                  const color = getLagColor(item.lag);
                  
                  return (
                    <TableRow
                      key={`${item.topic}-${item.partition}`}
                      sx={{
                        backgroundColor: item.lag > 0 ? `${color}15` : 'transparent',
                        '&:hover': {
                          backgroundColor: `${color}25`,
                        },
                      }}
                    >
                      <TableCell>{item.partition}</TableCell>
                      <TableCell align="right">{item.offset.toLocaleString()}</TableCell>
                      <TableCell align="right">{item.endOffset.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'bold',
                            color: color,
                          }}
                        >
                          {item.lag.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={severity.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: color,
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
      
      {lagData.length === 0 && (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
          No lag data available. Please connect to a Kafka cluster and select a consumer group.
        </Typography>
      )}
    </Box>
  );
};

export default ConsumerLagHeatmap;

