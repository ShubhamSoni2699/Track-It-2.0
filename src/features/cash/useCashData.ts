import { useQuery } from '@tanstack/react-query';
import { getCashData } from '../../services/apiCash';

export function useCashData() {
  const {
    isPending,
    data: CashData,
    error,
  } = useQuery({
    queryKey: ['Cash'],
    queryFn: getCashData,
  });
  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return { isPending, CashData };
}
