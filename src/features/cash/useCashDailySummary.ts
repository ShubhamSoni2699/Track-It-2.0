import { useQuery } from '@tanstack/react-query';
import {getDailyCashSummary } from '../../services/apiCash';

export function useCashDailySummary() {
  const {
    isPending,
    data: DaillyCashSummary,
    error,
  } = useQuery({
    queryKey: ['Daily_Cash_Summary'],
    queryFn: getDailyCashSummary,
  });

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { isPending, DaillyCashSummary };
}
