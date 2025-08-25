'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import PortfolioTabs from '../(home)/_components/PortfolioTabs';
import TimeframePills from '@/app/_components/TimeframePills/TimeframePills';
import CreatePortfolioButton from '@/app/_components/CreatePortfolioButton/CreatePortfolioButton';
import PortfolioHoldings from '@/app/_components/PortfolioHoldings/PortfolioHoldings';
import { usePortfolio } from '@/app/_contexts/PortfolioContext';
import {
  calculatePortfolioSummary,
  calculateAssetTypeValue,
  generateMockTimeSeries,
  getPortfolioAssetTypes,
} from '@/app/_utils/portfolioCalculations';
import { AssetType } from '@/app/_data/portfolioData';
import * as chartUtils from '../(home)/utils/chartUtils';
import { createApexOptions } from '../(home)/utils/apexOptions';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export type Timeframe = '1H' | '1D' | '1W' | '1M' | 'YTD' | '1Y' | 'ALL';
export type TabKey = 'overview' | AssetType;

export default function Portfolio() {
  const { getActivePortfolio, includeCashInPortfolio } = usePortfolio();
  const [active, setActive] = useState<TabKey>('overview');
  const [timeframe, setTimeframe] = useState<Timeframe>('YTD');
  const [mounted, setMounted] = useState(false);

  const activePortfolio = getActivePortfolio();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, start, end, title, availableTabs } = useMemo(() => {
    if (!mounted) {
      return {
        data: [],
        start: 0,
        end: 0,
        title: 'Total Worth',
        availableTabs: ['overview'] as TabKey[],
      };
    }

    // If no portfolio exists, return empty state
    if (!activePortfolio) {
      return {
        data: [],
        start: 0,
        end: 0,
        title: 'Total Worth',
        availableTabs: ['overview'] as TabKey[],
      };
    }

    const portfolioSummary = calculatePortfolioSummary(
      activePortfolio,
      includeCashInPortfolio,
    );
    const assetTypes = getPortfolioAssetTypes(activePortfolio);
    const availableTabs: TabKey[] = ['overview', ...assetTypes];

    let currentValue: number;
    let computedTitle: string;

    if (active === 'overview') {
      currentValue = portfolioSummary.totalValue;
      computedTitle = 'Total Worth';
    } else {
      currentValue = calculateAssetTypeValue(
        activePortfolio,
        active as AssetType,
      );
      const assetType = active as AssetType;
      computedTitle =
        assetType === 'crypto' ? 'Crypto Holdings'
        : assetType === 'stocks' ? 'Stocks Holdings'
        : assetType === 'indices' ? 'Indices Holdings'
        : assetType === 'funds' ? 'Funds Holdings'
        : assetType === 'commodities' ? 'Commodities Holdings'
        : assetType === 'nfts' ? 'NFT Holdings'
        : assetType === 'cash' ? 'Available Cash'
        : `${assetType} Holdings`;
    }

    const series = generateMockTimeSeries(currentValue, timeframe);
    const startVal = series.length > 0 ? series[0][1] : 0;
    const endVal = series.length > 0 ? series[series.length - 1][1] : 0;

    return {
      data: series,
      start: startVal,
      end: endVal,
      title: computedTitle,
      availableTabs,
    };
  }, [active, timeframe, mounted, activePortfolio, includeCashInPortfolio]);

  const performancePct =
    mounted && start !== 0 ? ((end - start) / start) * 100 : 0;

  const performanceAbs = mounted ? end - start : 0;

  const isLoss = performancePct < 0;

  // Reset active tab if it's no longer available
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(active)) {
      setActive('overview');
    }
  }, [availableTabs, active]);

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
              {performancePct >= 0 ? '+' : ''}
              {performancePct.toFixed(2)}%
            </span>
          )}
        </div>
      </div>

      <div className='mt-4'>
        <div className='mb-1 flex items-center justify-between'>
          <div />
          <TimeframePills value={timeframe} onChange={setTimeframe} />
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
