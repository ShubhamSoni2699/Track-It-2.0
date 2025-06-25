import styled from 'styled-components';
import DashboardBox from './DashboardBox';
import Heading from '../../ui/Heading';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';
import { usePerformanceEquity } from '../stocks/usePerformanceEquity';
import { useMemo } from 'react';

// Types
interface EquityDay {
  summary_date: string;
  daily_summary: string; // JSON string
}

type DailySummary = Record<string, { percent_change: number }>;
type DailyFlat = { summary_date: string } & Record<string, number>;
type MonthlyData = { summary_date: string } & Record<string, number>;

// Styled Component
const StyledDailyCashChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function MonthlyPerformanceStocksChart() {
  const { isDarkMode } = useDarkMode();

  const {
    isPending: isPendingEquityPerformance,
    error: errorEquityPerformance,
    EquityPerformance,
  } = usePerformanceEquity();

  const colors = isDarkMode
    ? {
        stroke: '#22c55e',
        text: '#e5e7eb',
        background: '#18212f',
      }
    : {
        stroke: '#16a34a',
        text: '#374151',
        background: '#fff',
      };

  // Transform equity data
  const { monthlyData, tickers } = useMemo((): {
    monthlyData: MonthlyData[];
    tickers: string[];
  } => {
    if (
      isPendingEquityPerformance ||
      !Array.isArray(EquityPerformance) ||
      EquityPerformance.length === 0
    ) {
      return { monthlyData: [], tickers: [] };
    }

    // Step 1: Flatten daily JSON summaries
    const dailyData: DailyFlat[] = EquityPerformance.map((obj: EquityDay) => {
      const dailySummary: DailySummary = JSON.parse(obj.daily_summary || '{}');

      const flattened: Record<string, number> = Object.fromEntries(
        Object.entries(dailySummary).map(([key, value]) => [
          key,
          value?.percent_change ?? 0,
        ])
      );

      return {
        summary_date: obj.summary_date,
        ...flattened,
      };
    }).sort((a, b) => new Date(a.summary_date).getTime() - new Date(b.summary_date).getTime());

    const allTickers = Object.keys(dailyData[0] || {}).filter(
      (key) => key !== 'summary_date'
    );

    // Step 2: Group by Month
    const monthlyMap: Record<string, Record<string, number[]>> = {};

    for (const entry of dailyData) {
      const monthKey = new Date(entry.summary_date).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });

      if (!monthlyMap[monthKey]) monthlyMap[monthKey] = {};

      for (const [ticker, val] of Object.entries(entry)) {
        if (ticker === 'summary_date') continue;
        if (!monthlyMap[monthKey][ticker]) monthlyMap[monthKey][ticker] = [];
        monthlyMap[monthKey][ticker].push(val);
      }
    }

    // Step 3: Compound monthly returns
    const monthlyData: MonthlyData[] = Object.entries(monthlyMap).map(([month, tickersObj]) => {
      const result: MonthlyData = { summary_date: month };

      for (const [ticker, returns] of Object.entries(tickersObj)) {
        const compounded = returns.reduce((acc, r) => acc * (1 + r / 100), 1);
        result[ticker] = +((compounded - 1) * 100).toFixed(2);
      }

      return result;
    });

    return { monthlyData, tickers: allTickers };
  }, [EquityPerformance, isPendingEquityPerformance]);

  if (errorEquityPerformance) {
    console.error(errorEquityPerformance);
  }

  return (
    <StyledDailyCashChart>
      {!isPendingEquityPerformance && monthlyData.length > 0 && (
        <>
          <Heading as="h2">Stocks Performance Monthly (%)</Heading>
          <ResponsiveContainer height={260} width="100%">
            <LineChart data={monthlyData}>
              <defs>
                <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.stroke} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="summary_date"
                tick={{
                  fill: colors.text,
                  fontSize: 12,
                  textAnchor: 'end',
                }}
                height={80}
                angle={-45}
                tickLine={{ stroke: colors.text }}
              />
              <YAxis
                unit="%"
                tick={{ fill: colors.text, fontSize: 12 }}
                tickLine={{ stroke: colors.text }}
              />
              <CartesianGrid strokeDasharray="4" />
              <Tooltip contentStyle={{ backgroundColor: colors.background }} />
              {tickers.map((ticker, index) => (
                <Line
                  key={ticker}
                  type="monotone"
                  dataKey={ticker}
                  stroke={`hsl(${(index * 45) % 360}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </StyledDailyCashChart>
  );
}

export default MonthlyPerformanceStocksChart;
