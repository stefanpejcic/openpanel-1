'use client';

import { fancyMinutes, useNumber } from '@/hooks/useNumerFormatter';
import type { IChartData } from '@/trpc/client';
import { cn } from '@/utils/cn';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Area, AreaChart } from 'recharts';

import type { IChartMetric } from '@openpanel/validation';

import {
  getDiffIndicator,
  PreviousDiffIndicatorText,
} from '../PreviousDiffIndicator';
import { useChartContext } from './ChartProvider';
import { SerieName } from './SerieName';

interface MetricCardProps {
  serie: IChartData['series'][number];
  color?: string;
  metric: IChartMetric;
  unit?: string;
}

export function MetricCard({
  serie,
  color: _color,
  metric,
  unit,
}: MetricCardProps) {
  const { previousIndicatorInverted, editMode } = useChartContext();
  const number = useNumber();

  const renderValue = (value: number, unitClassName?: string) => {
    if (unit === 'min') {
      return <>{fancyMinutes(value)}</>;
    }

    return (
      <>
        {number.short(value)}
        {unit && <span className={unitClassName}>{unit}</span>}
      </>
    );
  };

  const previous = serie.metrics.previous?.[metric];

  const graphColors = getDiffIndicator(
    previousIndicatorInverted,
    previous?.state,
    'green',
    'red',
    'blue'
  );

  return (
    <div
      className={cn(
        'group relative h-[70px] overflow-hidden',
        editMode && 'card h-[100px] px-4 py-2'
      )}
      key={serie.id}
    >
      <div
        className={cn(
          'pointer-events-none absolute -bottom-1 -left-1 -right-1 top-0 z-0 opacity-20 transition-opacity duration-300 group-hover:opacity-50',
          editMode && 'bottom-1'
        )}
      >
        <AutoSizer>
          {({ width, height }) => (
            <AreaChart
              width={width}
              height={height / 3}
              data={serie.data}
              style={{ marginTop: (height / 3) * 2 }}
            >
              <Area
                dataKey="count"
                type="monotone"
                fill={`transparent`}
                fillOpacity={1}
                stroke={graphColors}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          )}
        </AutoSizer>
      </div>
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 text-left font-semibold">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
              <SerieName name={serie.names} />
            </span>
          </div>
          {/* <PreviousDiffIndicator {...serie.metrics.previous[metric]} /> */}
        </div>
        <div className="flex items-end justify-between">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold">
            {renderValue(serie.metrics[metric], 'ml-1 font-light text-xl')}
          </div>
          <PreviousDiffIndicatorText
            {...previous}
            className="mb-0.5 text-xs font-medium"
          />
        </div>
      </div>
    </div>
  );
}

export function MetricCardEmpty() {
  return (
    <div className="card h-24 p-4">
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No data
      </div>
    </div>
  );
}

export function MetricCardLoading() {
  return (
    <div className="flex h-[70px] flex-col justify-between">
      <div className="h-4 w-1/2 animate-pulse rounded bg-def-200"></div>
      <div className="h-8 w-1/3 animate-pulse rounded bg-def-200"></div>
      <div className="h-3 w-1/5 animate-pulse rounded bg-def-200"></div>
    </div>
  );
}
