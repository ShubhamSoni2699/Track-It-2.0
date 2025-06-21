import { useQuery } from '@tanstack/react-query';
import { getDailyPerformanceEquity } from '../../services/apiEquity';

export function useDailyPerformanceEquity() {
  const {
    isPending,
    data: DailyEquityPerformance,
    error,
  } = useQuery({
    queryKey: ['Daily_Equity_Performance'],
    queryFn: getDailyPerformanceEquity,
  });
  return { isPending, error, DailyEquityPerformance };
}
