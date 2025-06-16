import { HiOutlineBriefcase, HiOutlineCurrencyRupee } from 'react-icons/hi';
import Stat from '../dashboard/Stat';
import { formatCurrency } from '../../utils/helpers';
import { HiOutlineBanknotes, HiOutlinePercentBadge } from 'react-icons/hi2';
import { usePrivacyMode } from '../../context/PrivacyModeContext';

function StatsStocks({
  stocksCurrentAmount,
  stockInvestedAmount,
  stockProfitLossToday,
  sotckProfitLossPerToday,
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
        title={`${stockProfitLossToday >= 0 ? 'Todays Profit' : 'Todays Loss'}`}
        color={`${stockProfitLossToday >= 0 ? 'green' : 'red'}`}
        icon={<HiOutlineBanknotes />}
        value={
          isPrivacyMode
            ? String(Math.round(stockProfitLossToday)).replace(/./g, '*')
            : formatCurrency(stockProfitLossToday)
        }
      />

      <Stat
        title={`${
          stockProfitLossToday >= 0 ? 'Todays Profit' : 'Todays Loss'
        } %`}
        color={`${stockProfitLossToday >= 0 ? 'green' : 'red'}`}
        icon={<HiOutlinePercentBadge />}
        value={`${sotckProfitLossPerToday} %`}
      />
    </>
  );
}

export default StatsStocks;
