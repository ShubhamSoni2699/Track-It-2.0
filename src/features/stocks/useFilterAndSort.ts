import { useSearchParams } from 'react-router-dom';
import { useEquityData } from './useEquityData';
import { useDailyPerformanceEquity } from './useDailyPerformanceEquity';

export function useFilterAndSort() {
  const { isPending, error, EquityData } = useEquityData();

  if (error) throw new Error(error.message);

  const [searchParams] = useSearchParams();

  const { isPending: isPendingPerformanceEquity, DailyEquityPerformance } =
    useDailyPerformanceEquity();

  let updatedEquityData;

  if (!isPendingPerformanceEquity && !isPending) {
    const data = JSON.parse(DailyEquityPerformance['daily_summary']);
    updatedEquityData = EquityData?.map((obj) => {
      return {
        ...obj,
        ltp_change: data[`${obj['ticker']}`]['ltp_change'],
        ltp_change_percent: data[`${obj['ticker']}`]['percent_change'],
      };
    });
  }

  //Filter

  // //SortBy
  const sortBy = searchParams.get('sortBy') || 'current_amount-decs';
  const [field, direction] = sortBy.split('-');
  const modifier = direction === 'asc' ? 1 : -1;
  const sortedEquityData =
    !isPending &&
    updatedEquityData?.sort((a, b) => {
      return (a[field] - b[field]) * modifier;
    });

  return { sortedEquityData, isPending };
}
