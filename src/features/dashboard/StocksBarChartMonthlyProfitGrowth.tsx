import styled from 'styled-components';
import Heading from '../../ui/Heading';
import {
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useDarkMode } from '../../context/DarkModeContext';
import { useEquitySummaryDataDaily } from '../stocks/useEquitySummaryDataDaily';

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 1 / span 4;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
  & .recharts-default-legend {
    font-size: 12px !important;
  }
`;

function StocksBarChartMonthlyProfitGrowth() {
  const { isDarkMode } = useDarkMode();
  const colorsTheme = isDarkMode
    ? {
        text: '#e5e7eb',
        background: '#18212f',
      }
    : {
        text: '#374151',
        background: '#fff',
      };

  const { isPending: isPendingEquitySummary, EquitySummaryDaily } =
    useEquitySummaryDataDaily();

  console.log(EquitySummaryDaily, isPendingEquitySummary);

  const Data = EquitySummaryDaily?.reduce((accumulator, row) => {
    const date = new Date(row.summary_date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const monthKey = `${year}-${month < 10 ? '0' : ''}${month}`;

    const amount = row.profit_loss;

    if (!accumulator[monthKey]) {
      accumulator[monthKey] = {
        month: monthKey,
        profit_loss: 0,
      };
    }

    accumulator[monthKey].profit_loss += amount;

    return accumulator;
  }, {});

  // Convert the aggregated object into an array of objects with 'date' and 'totalAmount'
  const barChartData = Data
    ? Object.keys(Data)
        ?.map((month) => ({
          month: month,
          profit_loss: Math.round(Data[month].profit_loss * 100) / 100,
          fill:
            Data[month].profit_loss >= 0
              ? 'var(--color-profit)'
              : 'var(--color-loss)',
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
    : null;

  const sum = barChartData?.reduce((acc, obj) => {
    return acc + obj.profit_loss;
  }, 0);

  const avgAmount = Math.round((sum / barChartData?.length) * 100) / 100;

  return (
    <ChartBox>
      <Heading as="h2">Monthly Profit (₹)</Heading>
      <ResponsiveContainer height={300} width="100%">
        {!isPendingEquitySummary && (
          <BarChart data={barChartData}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: colorsTheme.text }}
              textAnchor="end"
              height={60}
              angle={-45}
            />
            <YAxis tick={{ fontSize: 12, fill: colorsTheme.text }} />
            <Tooltip wrapperStyle={{
                backgroundColor: '#000',
                border: '1px solid #d3d3d3',
                borderRadius: '5px',
              }}  
              itemStyle={{ color: '#8884d8' }} // Color of the text items inside the tooltip
              labelStyle={{ color: '#8884d8' }} />
            <Legend
              verticalAlign="top"
              align="right"
              layout="vertical"
              iconSize={5}
              iconType="circle"
            />
            <Bar dataKey="profit_loss" fill='#8884d8'>
              {barChartData.map((entry) => (
                <Cell key={entry.month} fill={entry.fill} />
              ))}
            </Bar>
            <ReferenceLine y={avgAmount} stroke="green" strokeDasharray="3 3" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default StocksBarChartMonthlyProfitGrowth;
