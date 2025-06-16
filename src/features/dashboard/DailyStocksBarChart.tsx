import styled from 'styled-components';
import DashboardBox from './DashboardBox';
import Heading from '../../ui/Heading';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEquitySummaryDataDaily } from '../stocks/useEquitySummaryDataDaily';

const StyledDailyCashChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.2rem 3rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.2rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
  & .recharts-default-legend {
    font-size: 12px !important;
  }
`;

function DailyStocksBarChart() {
  // const isDarkMode = false;
  // const colors = isDarkMode
  //   ? {
  //       total_current_amount: { stroke: '#22c55e', fill: '#22c55e' },
  //       text: '#e5e7eb',
  //       background: '#18212f',
  //     }
  //   : {
  //       total_current_amount: { stroke: '#16a34a', fill: '#dcfce7' },
  //       text: '#374151',
  //       background: '#fff',
  //     };
  const { isPending: isPendingEquitySummaryDaily, EquitySummaryDaily } =
    useEquitySummaryDataDaily();

  const sortedDailyEquitySummary = EquitySummaryDaily?.sort((a, b) => {
    const dateA = new Date(a.summary_date); // field is 'date' here
    const dateB = new Date(b.summary_date);
    const dateComparison = dateA - dateB;
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return 1;
  });
  return (
    <StyledDailyCashChart>
      {!isPendingEquitySummaryDaily && (
        <>
          <Heading as="h2">Daily Capital (₹)</Heading>
          <ResponsiveContainer height={300} width="100%">
            {!isPendingEquitySummaryDaily && (
              <BarChart data={sortedDailyEquitySummary}>
                <XAxis
                  dataKey="summary_date"
                  tick={{ fontSize: 12 }}
                  textAnchor="end"
                  height={60}
                  angle={-45}
                />
                <YAxis  tick={{ fontSize: 12 }}/>
                <Tooltip />
                <Legend
                  verticalAlign="top"
                  align="right"
                  layout="vertical"
                  iconSize={5}
                  iconType="circle"
                  fontSize={5}
                />
                <Bar dataKey="total_current_amount" fill="#8884d8">
                  {sortedDailyEquitySummary.map((entry) => (
                    <Cell key={entry.summary_date} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </>
      )}
    </StyledDailyCashChart>
  );
}

export default DailyStocksBarChart;
