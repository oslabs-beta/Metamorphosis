'use client';

import React from 'react';
import { CardProp } from '@/types';
import { getSocket } from '@/lib/utils/socket';

interface MetricCardProps {
  data: CardProp;
  normalVal: number;
  userEmail?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ data, normalVal, userEmail }) => {
  const socket = getSocket();

  if (data.value !== null && data.value > normalVal && userEmail) {
    socket.emit('alert', { to: userEmail, subject: data.title });
  }

  const isOverThreshold = data.value !== null && data.value > normalVal;
  const titleClass = isOverThreshold ? 'metric-title-over' : 'metric-title';
  const valueClass = isOverThreshold ? 'metric-over-norm' : 'metric-val';
  const titleId = data.title.split(' ').join('');

  return (
    <div className="metric-card">
      <p id={titleId} className={titleClass}>
        {data.title}
      </p>
      <p id={`${titleId}Value`} className={valueClass}>
        {data.value ?? 'N/A'}
      </p>
    </div>
  );
};

export default MetricCard;

