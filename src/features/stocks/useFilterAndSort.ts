import { useSearchParams } from 'react-router-dom';
import { useEquityData } from './useEquityData';

export function useFilterAndSort() {
  const { isPending, error, EquityData } = useEquityData();

  if (error) throw new Error(error.message);

  const [searchParams] = useSearchParams();

  //Filter

  // //SortBy
  const sortBy = searchParams.get('sortBy') || 'current_amount-decs';
  const [field, direction] = sortBy.split('-');
  const modifier = direction === 'asc' ? 1 : -1;
  const sortedEquityData =
    !isPending &&
    EquityData?.sort((a, b) => {
      return (a[field] - b[field]) * modifier;
    });

  return { sortedEquityData, isPending };
}
