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
import { useFilterAndSort } from '../stocks/useFilterAndSort';
import { getColorsForPieChart } from './pieChartColors';
import { useDarkMode } from '../../context/DarkModeContext';

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2rem 1rem;
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

function addColorsToTickers(tickers, colors) {
  return tickers?.map((tickerObj, index) => {
    const colorIndex = index % colors.length;
    return {
      ...tickerObj,
      color: colors[colorIndex],
    };
  });
}

function StocksWeightBarChart() {
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
  const { sortedEquityData, isPending: isPendingSortedEquityData } =
    useFilterAndSort();
  let colors = getColorsForPieChart();
  const tickerWithColors = !isPendingSortedEquityData
    ? addColorsToTickers(sortedEquityData, colors)
    : '';

  return (
    <ChartBox>
      <Heading as="h2">Stock Weight (₹)</Heading>
      <ResponsiveContainer height={280} width="100%">
        {!isPendingSortedEquityData && (
          <BarChart data={tickerWithColors}>
            <XAxis
              dataKey="ticker"
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
            <Bar dataKey="current_amount" fill="#8884d8">
              {tickerWithColors?.map((entry) => (
                <Cell key={entry.ticker} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default StocksWeightBarChart;
