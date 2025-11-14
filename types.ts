import React from 'react';

//define types for metric card props
export interface CardProp {
	title: string, 
	value: number | null
}

//define types for graph props
export interface GraphProp {
	title: string,
	datapoints: {
		x: number[],
		y: number[]
	},
	color: string
}

export type ServerError = {
    error: string 
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  duration: number; // seconds
  enabled: boolean;
  notificationChannels: string[];
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  status: 'firing' | 'resolved';
  value: number;
  timestamp: number;
  resolvedAt?: number;
}

export interface MetricDataPoint {
  timestamp: number;
  value: number;
  labels?: Record<string, string>;
}

export interface TimeSeriesData {
  metric: string;
  labels: Record<string, string>;
  datapoints: MetricDataPoint[];
}
