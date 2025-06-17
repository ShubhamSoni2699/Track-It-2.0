import styled from 'styled-components';
import Stats from './Stats';
import { useCashData } from '../cash/useCashData';
import { useEquitySummaryData } from '../stocks/useEquitySummaryData';
import { useCashSummary } from '../cash/useCashSummary';
import { useStocksCount } from '../../hooks/useStocksCount';
import Spinner from '../../ui/Spinner';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

interface CashItem {
  amount: number;
  credit_debit: 'cr' | 'dr';
}

interface CashSummaryItem {
  net_balance: number;
}

interface EquitySummaryItem {
  total_current_amount: number;
}

function DashboardLayout() {
  const { isPending: isPendingCashData, CashData } = useCashData();

  const { isPending: isPendingEquitySummary, EquitySummary } =
    useEquitySummaryData();

  const { isPending: isPendingStocksCount, StocksCount } = useStocksCount();

  const { isPending: isPendingCashSummary, CashSummary } = useCashSummary();

  const isLoading =
    isPendingCashData ||
    isPendingEquitySummary ||
    isPendingStocksCount ||
    isPendingCashSummary;

  if (isLoading) {
    return <Spinner />;
  }

  if (!CashData || !CashSummary?.[0] || !EquitySummary?.[0] || !StocksCount) {
    return <div>Failed to load some dashboard data.</div>;
  }

  return (
    <StyledDashboardLayout>
      <Stats
        cashData={CashData}
        stocks={EquitySummary[0].total_current_amount}
        cashSummary={CashSummary[0].net_balance}
        stocksCount={StocksCount}
      />

      <div>Total Capital by day</div>
      <div>This Month's Spend</div>
      <div>Total Spend Category</div>
      <div>Chart</div>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
