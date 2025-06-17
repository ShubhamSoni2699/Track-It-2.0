import { HiOutlineBriefcase, HiOutlineCurrencyRupee } from 'react-icons/hi';
import Stat from './Stat';
import { HiOutlineRocketLaunch } from 'react-icons/hi2';
import { formatCurrency } from '../../utils/helpers';
function Stats({ cashData , stocks,cashSummary ,stocksCount}) {
  const totalTransections = cashData?.length;
  return (
    <>
      <Stat
        title="Stocks"
        color="blue"
        icon={<HiOutlineRocketLaunch />}
        value={formatCurrency(stocks)}
      />
      <Stat
        title="Total Stocks"
        color="indigo"
        icon={<HiOutlineBriefcase />}
        value={stocksCount}
      />
      <Stat
        title="Cash"
        color="green"
        icon={<HiOutlineCurrencyRupee />}
        value={formatCurrency(cashSummary)}
      />
      <Stat
        title="Total Transections"
        color="yellow"
        icon={<HiOutlineBriefcase />}
        value={totalTransections}
      />
    </>
  );
}

export default Stats;
