import { useQuery } from '@tanstack/react-query';
import { getEquitySummaryDaily } from '../../services/apiEquity';


export function useEquitySummaryDataDaily() {
  const {
    isPending,
    data: EquitySummaryDaily,
    error,
  } = useQuery({
    queryKey: ['Equity_Summary_Daily'],
    queryFn: getEquitySummaryDaily,
  });
  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return { isPending, EquitySummaryDaily };
}
