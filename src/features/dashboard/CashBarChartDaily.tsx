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

function CashBarChartDaily() {
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
    useFilterAndSort(false, 'current-month');

  const Data = filtedCashData?.reduce((accumulator, transaction) => {
    const date = transaction.date;
    const amount = transaction.amount;
    const type = transaction.credit_debit;

    if (type === 'dr') {
      accumulator[date] = (accumulator[date] || 0) + amount;
    }

    return accumulator;
  }, {});

  // Convert the aggregated object into an array of objects with 'date' and 'totalAmount'
  const barChartData = Data
    ? Object.keys(Data)
        ?.map((date) => ({
          date: date,
          totalAmount: Data[date],
        }))
        .sort((a, b) => {
          const dateA = new Date(a.date); // field is 'date' here
          const dateB = new Date(b.date);
          const dateComparison = dateA - dateB;
          if (dateComparison !== 0) {
            return dateComparison;
          }
          return 1;
        })
    : null;

  const sum = barChartData?.reduce((acc, obj) => {
    return acc + obj.totalAmount;
  }, 0);

  const avgAmount = Math.round((sum / barChartData?.length) * 100) / 100;

  return (
    <ChartBox>
      <Heading as="h2">Daily Spend (₹)</Heading>
      <ResponsiveContainer height={300} width="100%">
        {!isPendingsortedCashData && (
          <BarChart data={barChartData}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: colorsTheme.text }}
              textAnchor="end"
              height={60}
              angle={-45}
            />
            <YAxis tick={{ fontSize: 12, fill: colorsTheme.text }} />
            <Tooltip
              wrapperStyle={{
                backgroundColor: '#000',
                border: '1px solid #d3d3d3',
                borderRadius: '5px',
              }}
              itemStyle={{ color: '#8884d8' }} // Color of the text items inside the tooltip
              labelStyle={{ color: '#8884d8' }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              layout="vertical"
              iconSize={5}
              iconType="circle"
            />
            <Bar dataKey="totalAmount" fill="#8884d8">
              {barChartData.map((entry) => (
                <Cell key={entry.date} />
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

export default CashBarChartDaily;
