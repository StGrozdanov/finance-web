import { format } from 'date-fns';
import * as chartUtils from './chartUtils';

import type { ApexOptions } from 'apexcharts';

const gradientFrom = (loss: boolean) => (loss ? '#fda4a4' : '#32d296');
const gradientTo = (loss: boolean) => (loss ? '#ef4444' : '#10b981');
const lineColor = (loss: boolean) => (loss ? '#ef4444' : '#10b981');

export const createApexOptions = (isLoss: boolean): ApexOptions => {
  const from = gradientFrom(isLoss);
  const to = gradientTo(isLoss);
  const line = lineColor(isLoss);

  return {
    chart: { id: 'portfolio-area', toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 2, colors: [line] },
    markers: { size: 0, hover: { size: 0 } },
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 90, 100],
        colorStops: [
          [
            { offset: 0, color: from, opacity: 0.5 },
            { offset: 100, color: to, opacity: 0 },
          ],
        ],
      },
    },
    yaxis: {
      opposite: true,
      labels: {
        formatter: val => `$${chartUtils.formatNumber(val)}`,
        style: { colors: '#9CA3AF' },
      },
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: false,
      marker: { show: false },
      x: {
        formatter: val =>
          typeof val === 'number' ? format(new Date(val), 'MMM d HH:mm') : '',
      },
      y: {
        formatter: val =>
          typeof val === 'number' ? chartUtils.formatCurrencyFixed(val, 2) : '',
        title: { formatter: () => '' },
      },
      style: { fontSize: '12px' },
      theme: 'light',
    },
    xaxis: {
      ...({} as ApexXAxis),
      type: 'datetime',
      labels: {
        style: { colors: '#9CA3AF' },
        datetimeUTC: false,
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'MMM d',
          hour: 'HH:mm',
        },
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
      crosshairs: {
        show: true,
        position: 'back',
        stroke: { color: '#D1D5DB', width: 1, dashArray: 3 },
      },
      tooltip: { enabled: false },
    },
  };
};
