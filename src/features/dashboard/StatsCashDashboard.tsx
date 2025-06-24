import { HiOutlineBriefcase, HiOutlineCurrencyRupee } from 'react-icons/hi';
import Stat from './Stat';
import { HiOutlineFaceFrown, HiOutlineFaceSmile } from 'react-icons/hi2';
import { formatCurrency } from '../../utils/helpers';
import { usePrivacyMode } from '../../hooks/usePrivacyMode';

function StatsCashDashboard({ cashData, cashSummary }) {
  const totalTransections = cashData?.length;
  const { isPrivacyMode } = usePrivacyMode();

  const credit_debit = cashData.reduce(
    (acc, curr) => {
      if (curr.credit_debit === 'cr') {
        acc.credit += curr.amount;
      } else if (curr.credit_debit === 'dr') {
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
        value={
          isPrivacyMode
            ? String(Math.round(cashSummary)).replace(/./g, '*')
            : formatCurrency(cashSummary)
        }
      />
      <Stat
        title="Credit"
        color="green"
        icon={<HiOutlineFaceSmile />}
        value={
          isPrivacyMode
            ? String(Math.round(credit_debit.credit)).replace(/./g, '*')
            : formatCurrency(credit_debit.credit)
        }
      />
      <Stat
        title="debit"
        color="red"
        icon={<HiOutlineFaceFrown />}
        value={
          isPrivacyMode
            ? String(Math.round(credit_debit.debit)).replace(/./g, '*')
            : formatCurrency(credit_debit.debit)
        }
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
