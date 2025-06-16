import styled from 'styled-components';
import Stats from './Stats';
import { useCashData } from '../cash/useCashData';
import { useEquitySummaryData } from '../stocks/useEquitySummaryData';
import { useCashSummary } from '../cash/useCashSummary';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { isPending: isPendingCashData, CashData } = useCashData();

  const { isPending: isPendingEquitySummary, EquitySummary } =
    useEquitySummaryData();

  const { isPending: isPendingCashSummary, CashSummary } = useCashSummary();

  return (
    <StyledDashboardLayout>
      {!isPendingCashData &&
        !isPendingCashSummary &&
        !isPendingEquitySummary && (
          <Stats
            cashData={CashData}
            stocks={EquitySummary[0].total_current_amount}
            cashSummary={CashSummary[0].net_balance}
          />
        )}
      <div>Total Capital by day</div>
      <div>This Month's Spend</div>
      <div>Total Spend Category</div>
      <div>Chart</div>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
