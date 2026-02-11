import React from 'react';
import { Card, CardContent } from './ui/card';

import { TooltipProps } from 'recharts';

interface CustomTooltipProps extends TooltipProps<number, string> {}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const netChange = data.newFollowers - data.unfollows;

    return (
      <Card className="text-xs">
        <CardContent className="p-2">
          <p className="font-bold">{label}</p>
          <p className="text-green-500">New: {data.newFollowers}</p>
          <p className="text-red-500">Unfollows: {data.unfollows}</p>
          <p className={netChange >= 0 ? 'text-blue-400' : 'text-orange-400'}>
            Net: {netChange > 0 ? '+' : ''}
            {netChange}
          </p>
          <p className="text-white/60 mt-1">
            Total: {data.totalFollowers.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};
