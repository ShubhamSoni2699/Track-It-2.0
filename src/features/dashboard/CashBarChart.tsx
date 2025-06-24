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
} from 'recharts';
import { useFilterAndSort } from '../cash/useFilterAndSort';
import { getColorsForPieChart } from './pieChartColors';
import { useDarkMode } from '../../hooks/useDarkMode';

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

function CashBarChart() {
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

  const barChartData = tagTotalsWithColors
    ? Object.keys(tagTotalsWithColors)
        ?.map((tag) => {
          const tagData = tagTotalsWithColors[tag];
          return {
            name: tag, // The tag name will be the slice label
            value: Math.round(tagData.amount * 100) / 100, // The total amount will be the slice value
            fill: tagData.color, // The assigned color will be the slice color
          };
        })
        .sort((a, b) => b.value - a.value)
    : null;

  return (
    <ChartBox>
      <Heading as="h2">Category Wise Spend (₹)</Heading>
      <ResponsiveContainer height={300} width="100%">
        {!isPendingsortedCashData && (
          <BarChart data={barChartData}>
            <XAxis
              dataKey="name"
              tick={false}
              // tick={{ fontSize: 12 }}
              // textAnchor="end"
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
            <Bar dataKey="value" fill="#8884d8">
              {barChartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default CashBarChart;
