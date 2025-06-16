import styled from 'styled-components';
import StatsCashDashboard from './StatsCashDashboard';
import { useCashSummary } from '../cash/useCashSummary';
import DailyCashChart from './DailyCashChart';
import CashBarChart from './CashBarChart';
import CashPieChartPer from './CashPieChartPer';
import { useFilterAndSort } from '../cash/useFilterAndSort';
import CashTopTransaction from './CashTopCreditDebit';
import CashBarChartDaily from './CashBarChartDaily';
import { useSearchParams } from 'react-router-dom';
import CashBarChartMonthly from './CashBarChartMonthly';
import CashBarChartSpendYearly from './CashBarChartSpendYearly';

const DEFAULT_FILTER_VALUE = 'current-month';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { isPending: isPendingCashSummary, CashSummary } = useCashSummary();

  const { filtedCashData: CashData, isPending: isPendingsortedCashData } =
    useFilterAndSort(false, DEFAULT_FILTER_VALUE);

  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get('filter') || DEFAULT_FILTER_VALUE;

  return (
    <StyledDashboardLayout>
      {!isPendingsortedCashData && !isPendingCashSummary && (
        <StatsCashDashboard
          cashData={CashData}
          cashSummary={CashSummary[0].net_balance}
        />
      )}
      <DailyCashChart />
      <CashPieChartPer />
      <CashBarChart />
      {filterValue === 'all' ? <CashBarChartSpendYearly /> : ''}
      {filterValue === 'all' ? <CashBarChartMonthly /> : ''}
      <CashBarChartDaily />
      <CashTopTransaction />
      {/* <div>This Month's Spend</div>
      <div>Total Spend Category</div>
      <div>Chart</div> */}
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
