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
import { useFilterAndSort } from '../stocks/useFilterAndSort';
import { getColorsForPieChart } from './pieChartColors';
import { useEquitySummaryData } from '../stocks/useEquitySummaryData';

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

function addColorsToTickers(tickers, colors, capital) {
  return tickers?.map((tickerObj, index) => {
    const colorIndex = index % colors.length;
    const amount = tickerObj.current_amount;
    return {
      ...tickerObj,
      percentage: Math.round((amount / capital) * 100 *100) / 100,
      color: colors[colorIndex],
    };
  });
}

function StocksWeightPieChartPer() {
  const { sortedEquityData, isPending: isPendingSortedEquityData } =
    useFilterAndSort();

  const { isPending: isPendingEquitySummary, EquitySummary } = useEquitySummaryData();

  const capital = !isPendingEquitySummary
    ? EquitySummary[0].total_current_amount
    : null;

  let colors = getColorsForPieChart();
  const tickerWithColorsAndPer = !isPendingSortedEquityData
    ? addColorsToTickers(sortedEquityData, colors, capital)
    : '';

  return (
    <ChartBox>
      <Heading as="h2">Stock Weight (%)</Heading>
      <ResponsiveContainer height={240} width="100%">
        {!isPendingSortedEquityData && (
          <PieChart>
            <Pie
              data={tickerWithColorsAndPer}
              dataKey="percentage"
              nameKey="ticker"
              cx="40%"
              cy="50%"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={5}
            >
              {tickerWithColorsAndPer?.map((entry) => (
                <Cell
                  fill={entry.color}
                  stroke={entry.color}
                  strokeWidth={2}
                  key={entry.ticker}
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

export default StocksWeightPieChartPer;
