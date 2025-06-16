import { HiOutlineBriefcase, HiOutlineCurrencyRupee } from 'react-icons/hi';
import Stat from '../dashboard/Stat';
import { formatCurrency } from '../../utils/helpers';
import { HiOutlineBanknotes, HiOutlinePercentBadge } from 'react-icons/hi2';

function StatsStocks({
  stocksCurrentAmount,
  stockInvestedAmount,
  stockProfitLossToday,
  sotckProfitLossPerToday,
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
        title={`${stockProfitLossToday >= 0 ? 'Todays Profit' : 'Todays Loss'}`}
        color={`${stockProfitLossToday >= 0 ? 'green' : 'red'}`}
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(stockProfitLossToday)}
      />

      <Stat
        title={`${stockProfitLossToday >= 0 ? 'Todays Profit' : 'Todays Loss'} %`}
        color={`${stockProfitLossToday >= 0 ? 'green' : 'red'}`}
        icon={<HiOutlinePercentBadge />}
        value={`${sotckProfitLossPerToday} %`}
      />
    </>
  );
}

export default StatsStocks;
