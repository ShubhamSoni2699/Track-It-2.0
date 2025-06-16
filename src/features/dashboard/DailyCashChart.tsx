import styled from 'styled-components';
import DashboardBox from './DashboardBox';
import Heading from '../../ui/Heading';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useCashDailySummary } from '../cash/useCashDailySummary';
import { useDarkMode } from '../../context/DarkModeContext';

const StyledDailyCashChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function DailyCashChart() {
  const {isDarkMode} = useDarkMode();
  const colors = isDarkMode
    ? {
        net_balance: { stroke: '#22c55e', fill: '#22c55e' },
        text: '#e5e7eb',
        background: '#18212f',
      }
    : {
        net_balance: { stroke: '#16a34a', fill: '#dcfce7' },
        text: '#374151',
        background: '#fff',
      };
  const { isPending: isPendingDailyCashSummary, DaillyCashSummary } =
    useCashDailySummary();
  const sortedDailyCashSummary = DaillyCashSummary?.sort((a, b) => {
          const dateA = new Date(a.date); // field is 'date' here
          const dateB = new Date(b.date);
          const dateComparison = dateA - dateB;
          if (dateComparison !== 0) {
            return dateComparison ;
          } return 1
        });
  return (
    <StyledDailyCashChart>
      {!isPendingDailyCashSummary && (
        <>
          <Heading as="h2">Capital</Heading>
          <ResponsiveContainer
            height={260}
            width="100%"
            margin={{ top: 10, right: 30, left: 0, bottom: 50, }}
          >
            <AreaChart data={sortedDailyCashSummary}>
              <defs>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
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
                unit="₹"
                tick={{ fill: colors.text, fontSize: 12 }}
                tickLine={{ stroke: colors.text }}
              />
              <CartesianGrid strokeDasharray="4" />
              <Tooltip contentStyle={{ backgroundColor: colors.background }} />
              <Area
                dataKey="net_balance"
                type="monotone"
                stroke={colors.net_balance.stroke}
                fillOpacity={0.4}
                fill={colors.net_balance.fill}
                strokeWidth={2}
                name="Net Balance"
                unit="₹"
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </StyledDailyCashChart>
  );
}

export default DailyCashChart;
