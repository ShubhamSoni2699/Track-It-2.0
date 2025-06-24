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

const StyledDailyCashChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function DailyPerformanceStocksChart() {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode
    ? {
        total_current_amount: { stroke: '#22c55e', fill: '#22c55e' },
        text: '#e5e7eb',
        background: '#18212f',
      }
    : {
        total_current_amount: { stroke: '#16a34a', fill: '#dcfce7' },
        text: '#374151',
        background: '#fff',
      };

  const {
    isPending: isPendingEquityPerformance,
    error: errorEquityPerformance,
    EquityPerformance,
  } = usePerformanceEquity();

  if (errorEquityPerformance) {
    console.log(errorEquityPerformance);
  }

  let stockPerformanceData;
  let tickers;

  if (!isPendingEquityPerformance) {
    stockPerformanceData = EquityPerformance?.map((obj) => {
      const todaysSummary = JSON.parse(obj['daily_summary']);
      const transformedSummary = Object.fromEntries(
        Object.entries(todaysSummary).map(([key, value]) => [
          key,
          value.percent_change,
        ])
      );
      return { summary_date: obj['summary_date'], ...transformedSummary };
    })?.sort((a, b) => {
      const dateA = new Date(a.summary_date); // field is 'date' here
      const dateB = new Date(b.summary_date);
      const dateComparison = dateA - dateB;
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return 1;
    });
    tickers = Object.keys(stockPerformanceData[0])?.filter(
      (key) => key !== 'summary_date'
    );
  }

  return (
    <StyledDailyCashChart>
      {!isPendingEquityPerformance && (
        <>
          <Heading as="h2">Stocks Performance (%)</Heading>
          <ResponsiveContainer
            height={260}
            width="100%"
            margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
          >
            <LineChart data={stockPerformanceData}>
              <defs>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
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
                  stroke={`hsl(${(index * 50) % 360}, 70%, 50%)`} // dynamic color
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

export default DailyPerformanceStocksChart;
