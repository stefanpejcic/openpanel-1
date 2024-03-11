import { useDispatch, useSelector } from '@/redux';
import {
  isHourIntervalEnabledByRange,
  isMinuteIntervalEnabledByRange,
} from '@openpanel/constants';
import type { IInterval } from '@openpanel/validation';
import { ClockIcon } from 'lucide-react';

import { Combobox } from '../ui/combobox';
import { changeInterval } from './reportSlice';

interface ReportIntervalProps {
  className?: string;
}
export function ReportInterval({ className }: ReportIntervalProps) {
  const dispatch = useDispatch();
  const interval = useSelector((state) => state.report.interval);
  const range = useSelector((state) => state.report.range);
  const chartType = useSelector((state) => state.report.chartType);
  if (
    chartType !== 'linear' &&
    chartType !== 'histogram' &&
    chartType !== 'area' &&
    chartType !== 'metric'
  ) {
    return null;
  }

  return (
    <Combobox
      icon={ClockIcon}
      className={className}
      placeholder="Interval"
      onChange={(value) => {
        dispatch(changeInterval(value));
      }}
      value={interval}
      items={[
        {
          value: 'minute',
          label: 'Minute',
          disabled: !isMinuteIntervalEnabledByRange(range),
        },
        {
          value: 'hour',
          label: 'Hour',
          disabled: !isHourIntervalEnabledByRange(range),
        },
        {
          value: 'day',
          label: 'Day',
        },
        {
          value: 'month',
          label: 'Month',
          disabled:
            range === 'today' ||
            range === '24h' ||
            range === '1h' ||
            range === '30min',
        },
      ]}
    />
  );
}
