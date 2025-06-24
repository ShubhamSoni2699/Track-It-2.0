import { HiOutlineBriefcase, HiOutlineCurrencyRupee } from 'react-icons/hi';
import Stat from './Stat';
import { formatCurrency } from '../../utils/helpers';
import { HiOutlineBanknotes, HiOutlinePercentBadge } from 'react-icons/hi2';
import { usePrivacyMode } from '../../hooks/usePrivacyMode';

function StatsStockDashboard({
  stocksCurrentAmount,
  stockInvestedAmount,
  stockProfitLoss,
  sotckProfitLossPer,
}) {
  const { isPrivacyMode } = usePrivacyMode();
  return (
    <>
      <Stat
        title="Invested Amount"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={
          isPrivacyMode
            ? String(Math.round(stockInvestedAmount)).replace(/./g, '*')
            : formatCurrency(stockInvestedAmount)
        }
      />

      <Stat
        title="Current Amount"
        color="indigo"
        icon={<HiOutlineCurrencyRupee />}
        value={
          isPrivacyMode
            ? String(Math.round(stocksCurrentAmount)).replace(/./g, '*')
            : formatCurrency(stocksCurrentAmount)
        }
      />

      <Stat
        title={`${stockProfitLoss >= 0 ? 'Profit' : 'Loss'}`}
        color="green"
        icon={<HiOutlineBanknotes />}
        value={
          isPrivacyMode
            ? String(Math.round(stockProfitLoss)).replace(/./g, '*')
            : formatCurrency(stockProfitLoss)
        }
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
