import { useQuery } from '@tanstack/react-query';
import { getEquitySummary } from '../../services/apiEquity';


export function useEquitySummaryData() {
  const {
    isPending,
    data: EquitySummary,
    error,
  } = useQuery({
    queryKey: ['Equity_Summary'],
    queryFn: getEquitySummary,
  });
  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return { isPending, EquitySummary };
}
