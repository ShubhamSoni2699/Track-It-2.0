import styled from 'styled-components';
import { useEquitySummaryData } from '../stocks/useEquitySummaryData';
import StatsStockDashboard from './StatsStockDashboard';
import DailyStocksChart from './DailyStocksChart';
import StocksWeightBarChart from './StocksWeightBarChart';
import StocksWeightPieChartPer from './StocksWeightPieChartPer';
import DailyStocksBarChart from './DailyStocksBarChart';
import StocksBarChartMonthlyProfitGrowth from './StocksBarChartMonthlyProfitGrowth';
import StocksDailyPerformance from './StocksDailyPerformance';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 1rem;
`;

function DashboardLayoutStocks() {
  const { isPending: isPendingEquitySummary, EquitySummary } =
    useEquitySummaryData();

  return (
    <StyledDashboardLayout>
      {!isPendingEquitySummary && (
        <StatsStockDashboard
          stocksCurrentAmount={EquitySummary[0].total_current_amount}
          stockInvestedAmount={EquitySummary[0].total_invested_amount}
          stockProfitLoss={EquitySummary[0].profit_loss}
          sotckProfitLossPer={EquitySummary[0].percentage_profit_loss}
        />
      )}
      <DailyStocksChart />
      <StocksBarChartMonthlyProfitGrowth />
      <StocksWeightPieChartPer />
      <StocksWeightBarChart />
      <StocksDailyPerformance/>
      {/* <DailyCashChart />
      <CashPieChartPer/>
      <CashBarChart />
      <CashBarChartDaily/>
      <CashTopTransaction/> */}
      {/* <div>This Month's Spend</div>
      <div>Total Spend Category</div>
      <div>Chart</div> */}
    </StyledDashboardLayout>
  );
}

export default DashboardLayoutStocks;
