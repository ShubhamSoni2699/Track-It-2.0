import { useQuery } from '@tanstack/react-query';
import { getEquityData } from '../../services/apiEquity';

export function useEquityData() {
  const {
    isPending,
    data: EquityData,
    error,
  } = useQuery({
    queryKey: ['Equity'],
    queryFn: getEquityData,
  });
  return { isPending, error, EquityData };
}
