import { useQuery } from '@tanstack/react-query';
import { getStocksCount } from '../services/apiEquity';

export function useStocksCount() {

  const {
    isPending,
    data:StocksCount,
    error,
  } = useQuery({
    queryKey: ['stocks_count'],
    queryFn: getStocksCount,
  });

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { isPending, StocksCount };
}
