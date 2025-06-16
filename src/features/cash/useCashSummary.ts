import { useQuery } from '@tanstack/react-query';
import { getCashSummary } from '../../services/apiCash';

export function useCashSummary() {
  const {
    isPending,
    data: CashSummary,
    error,
  } = useQuery({
    queryKey: ['Cash_Summary'],
    queryFn: getCashSummary,
  });

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { isPending, CashSummary };
}
