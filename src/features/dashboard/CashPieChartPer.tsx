import styled from 'styled-components';
import Heading from '../../ui/Heading';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useFilterAndSort } from '../cash/useFilterAndSort';
import { getColorsForPieChart } from './pieChartColors';

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 1 / span 2;

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

function CashPieChartPer() {
  const { filtedCashData, isPending: isPendingsortedCashData } =
    useFilterAndSort(false,'current-month');

  const totalCreditAmount = filtedCashData
  ? filtedCashData.reduce((accumulator, transaction) => {
      return transaction.credit_debit === 'cr'
        ? accumulator + transaction.amount
        : accumulator;
    }, 0)
  : 0;

  let colors = getColorsForPieChart();
  let colorIndex = 0;
  const tagTotalsWithColors = filtedCashData?.reduce(
    (accumulator, transaction) => {
      if (transaction.credit_debit === 'dr') {
        const tag = transaction.tag;
        const amount = transaction.amount;
        if (!accumulator[tag]) {
          const assignedColor = colors[colorIndex % colors.length];
          accumulator[tag] = {
            amount: 0,
            color: assignedColor,
          };
          colorIndex++;
        }
        accumulator[tag].amount += amount;
      }
      return accumulator;
    },
    {}
  );

  const pieChartData = tagTotalsWithColors
    ? Object.keys(tagTotalsWithColors)?.map((tag) => {
        const tagData = tagTotalsWithColors[tag];
        const perData = totalCreditAmount!==0 ? (tagData.amount / totalCreditAmount)*100 :1;
        return {
          name: tag, // The tag name will be the slice label
          value: Math.round(perData*100)/100, // The total amount will be the slice value
          fill: tagData.color, // The assigned color will be the slice color
        };
      }).sort((a,b)=>{return a.value - b.value})
    : null;

  return (
    <ChartBox>
      <Heading as="h2">Category Wise Spend (%)</Heading>
      <ResponsiveContainer height={300} width="100%">
        {!isPendingsortedCashData && (
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="40%"
              cy="50%"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={5}
            >
              {pieChartData.map((entry) => (
                <Cell
                  fill={entry.fill}
                  stroke={entry.fill}
                  strokeWidth={2}
                  key={entry.name}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="middle"
              align="right"
              width="30%"
              layout="vertical"
              iconSize={5}
              iconType="circle"
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default CashPieChartPer;
