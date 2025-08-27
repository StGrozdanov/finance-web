'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PortfolioTabs from './components/PortfolioTabs/PortfolioTabs';
import TimeframePills from '@/app/_components/TimeframePills/TimeframePills';
import CreatePortfolioButton from './components/CreatePortfolioButton/CreatePortfolioButton';
import PortfolioHoldings from './components/PortfolioHoldings/PortfolioHoldings';
import { usePortfolio } from '@/hooks/usePortfolioContext';
import { usePortfolioChart } from './hooks/usePortfolioChart';
import * as chartUtils from '@/utils/formatters';
import { createApexOptions } from './utils/apexOptions';

import type { AssetType } from '../../../utils/mockHoldingsData';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export type Timeframe = '1H' | '1D' | '1W' | '1M' | 'YTD' | '1Y' | 'ALL';
export type TabKey = 'overview' | AssetType;

const availableTimeframes: Timeframe[] = [
  '1H',
  '1D',
  '1W',
  '1M',
  'YTD',
  '1Y',
  'ALL',
];

export default function Portfolio() {
  const { getActivePortfolio, includeCashInPortfolio } = usePortfolio();
  const [active, setActive] = useState<TabKey>('overview');
  const [timeframe, setTimeframe] = useState<Timeframe>('YTD');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, start, end, title, availableTabs } = usePortfolioChart({
    activePortfolio: getActivePortfolio(),
    active,
    timeframe,
    mounted,
    includeCashInPortfolio,
  });

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(active)) {
      setActive('overview');
    }
  }, [availableTabs, active]);

  const performancePct =
    mounted && start !== 0 ? ((end - start) / start) * 100 : 0;

  const performanceAbs = mounted ? end - start : 0;

  const isLoss = performancePct < 0;

  return (
    <div className='px-8 py-4'>
      <PortfolioTabs
        active={active}
        onChange={setActive}
        availableTabs={availableTabs}
      />

      <div className='mt-6'>
        <div className='text-lg md:text-xl font-semibold text-gray-700'>
          {title}
        </div>
        <div className='text-4xl font-extrabold mt-1'>
          {mounted ? chartUtils.formatCurrencyFixed(end, 2) : '—'}
        </div>
        <div className='mt-2 flex items-center gap-3'>
          <span
            className={`${performanceAbs >= 0 ? 'text-emerald-600' : 'text-red-600'} font-medium`}
          >
            {mounted ?
              <>
                {performanceAbs >= 0 ? '+' : ''}
                {chartUtils.formatCurrencyFixed(performanceAbs, 2)}
              </>
            : '—'}
          </span>
          {mounted && (
            <span
              className={`inline-flex items-center rounded px-2 py-1 text-sm font-semibold ${
                performancePct < 0 ?
                  'bg-red-100 text-red-700'
                : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {chartUtils.formatPercentage(performancePct)}
            </span>
          )}
        </div>
      </div>

      <div className='mt-4'>
        <div className='mb-1 flex items-center justify-between'>
          <div />
          <TimeframePills
            value={timeframe}
            onChange={setTimeframe}
            availableTimeframes={availableTimeframes}
          />
        </div>
        {mounted ?
          <ReactApexChart
            type='area'
            options={createApexOptions(isLoss)}
            series={[
              {
                name: 'Value',
                data,
              },
            ]}
            height={300}
            key={`${active}-${timeframe}`}
          />
        : <div className='h-[300px] w-full rounded-md bg-gradient-to-b from-emerald-200/30 to-transparent' />
        }
      </div>

      <PortfolioHoldings
        activeTab={active}
        timeframe={timeframe}
        onTabChange={setActive}
      />

      <CreatePortfolioButton />
    </div>
  );
}
