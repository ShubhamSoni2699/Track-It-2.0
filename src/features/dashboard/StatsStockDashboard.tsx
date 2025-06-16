import { HiOutlineBriefcase, HiOutlineCurrencyRupee } from 'react-icons/hi';
import Stat from './Stat';
import { formatCurrency } from '../../utils/helpers';
import { HiOutlineBanknotes, HiOutlinePercentBadge } from 'react-icons/hi2';

function StatsStockDashboard({
  stocksCurrentAmount,
  stockInvestedAmount,
  stockProfitLoss,
  sotckProfitLossPer,
}) {
  return (
    <>
      <Stat
        title="Invested Amount"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={formatCurrency(stockInvestedAmount)}
      />

      <Stat
        title="Current Amount"
        color="indigo"
        icon={<HiOutlineCurrencyRupee />}
        value={formatCurrency(stocksCurrentAmount)}
      />

      <Stat
        title={`${stockProfitLoss >= 0 ? 'Profit' : 'Loss'}`}
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(stockProfitLoss)}
      />

      <Stat
        title={`${stockProfitLoss >= 0 ? 'Profit' : 'Loss'} %`}
        color="yellow"
        icon={<HiOutlinePercentBadge />}
        value={`${sotckProfitLossPer} %`}
      />
    </>
  );
}

export default StatsStockDashboard;
