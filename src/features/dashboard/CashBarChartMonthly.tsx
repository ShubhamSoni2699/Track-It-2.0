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
import { useFilterAndSort } from '../cash/useFilterAndSort';
import { useDarkMode } from '../../context/DarkModeContext';

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

function CashBarChartMonthly() {
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

  const { filtedCashData, isPending: isPendingsortedCashData } =
    useFilterAndSort(false);

  const Data = filtedCashData?.reduce((accumulator, transaction) => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const monthKey = `${year}-${month < 10 ? '0' : ''}${month}`;

    const amount = Math.round(transaction.amount);
    const type = transaction.credit_debit;

    if (!accumulator[monthKey]) {
      accumulator[monthKey] = {
        month: monthKey,
        totalAmount: 0,
      };
    }

    if (type === 'dr') {
      accumulator[monthKey].totalAmount += amount;
    }

    return accumulator;
  }, {});

  // Convert the aggregated object into an array of objects with 'date' and 'totalAmount'
  const barChartData = Data
    ? Object.keys(Data)
        ?.map((month) => ({
          month: month,
          totalAmount: Data[month].totalAmount,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
    : null;

  const sum = barChartData?.reduce((acc, obj) => {
    return acc + obj.totalAmount;
  }, 0);

  const avgAmount = Math.round((sum / barChartData?.length) * 100) / 100;

  return (
    <ChartBox>
      <Heading as="h2">Monthly Spend (₹)</Heading>
      <ResponsiveContainer height={300} width="100%">
        {!isPendingsortedCashData && (
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
              itemStyle={{ color: '#F0B27A' }} // Color of the text items inside the tooltip
              labelStyle={{ color: '#F0B27A' }} />
            <Legend
              verticalAlign="top"
              align="right"
              layout="vertical"
              iconSize={5}
              iconType="circle"
            />
            <Bar dataKey="totalAmount" fill="#F0B27A">
              {barChartData.map((entry) => (
                <Cell key={entry.month} />
              ))}
            </Bar>
            <ReferenceLine y={avgAmount} stroke="green" strokeDasharray="3 3" label={{
                value: avgAmount,
                position: 'left', // 'right', 'top', 'bottom' also possible
                fill: 'green',
                fontSize: 12,
                fontWeight: 'bold',
              }} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default CashBarChartMonthly;
