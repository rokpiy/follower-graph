import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { DailyStat } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface FollowerChartProps {
  data: DailyStat[];
  height?: string;
}

import { CustomTooltip } from './CustomTooltip';

export const FollowerChart: React.FC<FollowerChartProps> = ({
  data,
  height = 'h-[380px]',
}) => {
  const chartData = data.map((d) => ({
    ...d,
    unfollowsDisplay: -Math.abs(d.unfollows),
  }));

  return (
    <Card className={height}>
      <CardHeader className="pb-4">
        <CardTitle>Growth Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                bottom: 20,
                left: 0,
              }}
              stackOffset="sign"
              barCategoryGap="20%"
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                minTickGap={30}
              />

              <YAxis
                yAxisId="left"
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                label={{
                  value: 'Total',
                  angle: -90,
                  position: 'insideLeft',
                  fill: 'rgba(255,255,255,0.6)',
                }}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                label={{
                  value: 'Daily',
                  angle: 90,
                  position: 'insideRight',
                  fill: 'rgba(255,255,255,0.6)',
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                verticalAlign="top"
                height={36}
                content={
                  <div className="flex justify-center gap-6 mb-4 text-xs font-medium text-white/80">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-400" />
                      <span>New Followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-400" />
                      <span>Unfollowers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-1 bg-white" />
                      <span>Total</span>
                    </div>
                  </div>
                }
              />

              <ReferenceLine
                y={0}
                yAxisId="right"
                stroke="rgba(255,255,255,0.2)"
              />

              <Bar
                yAxisId="right"
                dataKey="newFollowers"
                name="New Followers"
                stackId="stack"
                barSize={6}
                fill="rgb(74, 222, 128)"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                yAxisId="right"
                dataKey="unfollowsDisplay"
                name="Unfollowers"
                stackId="stack"
                barSize={6}
                fill="rgb(248, 113, 113)"
                radius={[4, 4, 0, 0]}
              />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalFollowers"
                name="Total Followers"
                stroke="#fff"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
