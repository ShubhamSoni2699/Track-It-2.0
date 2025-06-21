import { useQuery } from '@tanstack/react-query';
import { getPerformanceEquity } from '../../services/apiEquity';

export function usePerformanceEquity() {
  const {
    isPending,
    data: EquityPerformance,
    error,
  } = useQuery({
    queryKey: ['Equity_Performance'],
    queryFn: getPerformanceEquity,
  });
  return { isPending, error, EquityPerformance };
}