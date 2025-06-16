import { HiOutlineBriefcase, HiOutlineCurrencyRupee } from 'react-icons/hi';
import Stat from './Stat';
import { HiOutlineFaceFrown, HiOutlineFaceSmile } from 'react-icons/hi2';
import { formatCurrency } from '../../utils/helpers';

function StatsCashDashboard({ cashData ,cashSummary }) {

  const totalTransections = cashData?.length;
  
  const credit_debit = cashData.reduce(
  (acc, curr) => {
    if (curr.credit_debit === "cr") {
      acc.credit += curr.amount;
    } else if (curr.credit_debit === "dr") {
      acc.debit += curr.amount;
    }
    return acc;
  },
  { credit: 0, debit: 0 }
);

  return (
    <>
        <Stat
          title="Cash"
          color="green"
          icon={<HiOutlineCurrencyRupee />}
          value={formatCurrency(cashSummary)}
        />
      <Stat
        title="Credit"
        color="green"
        icon={<HiOutlineFaceSmile />}
        value={formatCurrency(credit_debit.credit)}
      />
      <Stat
        title="debit"
        color="red"
        icon={<HiOutlineFaceFrown />}
        value={formatCurrency(credit_debit.debit)}
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

export default StatsCashDashboard;
