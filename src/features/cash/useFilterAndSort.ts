import { useSearchParams } from 'react-router-dom';
import { useCashData } from './useCashData';
import getCurrentMonth from '../../services/apiGetCurrentMonth';

export function useFilterAndSort(isSort = true, defalutValue = 'all') {
  const { isPending, CashData, error } = useCashData();

  if (error) throw new Error(error.message);

  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get('filter') || defalutValue;

  //Filter
  let filtedCashData;
  if (filterValue === 'all') filtedCashData = !isPending ? CashData : null;
  else if (filterValue === 'current-month') {
    const { currentMonthTwoDigits, daysInCurrentMonth, currentYear } =
      getCurrentMonth();
    let startDate = new Date(`${currentYear}-${currentMonthTwoDigits}-01`);
    let lastDate = new Date(
      `${currentYear}-${currentMonthTwoDigits}-${daysInCurrentMonth}`
    );
    !isPending
      ? (filtedCashData = CashData.filter((data) => {
          const date = new Date(data.date);
          return date >= startDate && date <= lastDate;
        }))
      : '';
  } else if (filterValue === 'last-month') {
    let { currentYear, previousMonthTwoDigits, daysInPreviousMonth } =
      getCurrentMonth();
    currentYear =
      previousMonthTwoDigits === '12' ? currentYear - 1 : currentYear;
    let startDate = new Date(`${currentYear}-${previousMonthTwoDigits}-01`);
    let lastDate = new Date(
      `${currentYear}-${previousMonthTwoDigits}-${daysInPreviousMonth}`
    );
    !isPending
      ? (filtedCashData = CashData.filter((data) => {
          const date = new Date(data.date);
          return date >= startDate && date <= lastDate;
        }))
      : '';
  }

  if (isSort === false) return { filtedCashData, isPending };

  // //SortBy
  const sortBy = searchParams.get('sortBy') || 'date-decs';
  const [field, direction] = sortBy.split('-');
  const modifier = direction === 'asc' ? 1 : -1;
  const sortedCashData =
    !isPending && field === 'date'
      ? filtedCashData?.sort((a, b) => {
          const dateA = new Date(a[field]); // field is 'date' here
          const dateB = new Date(b[field]);
          const dateComparison = dateA - dateB;
          if (dateComparison !== 0) {
            return dateComparison * modifier;
          } else {
            const secondaryFieldName = 'id';
            const secondaryFieldA = a[secondaryFieldName];
            const secondaryFieldB = b[secondaryFieldName];
            const secondaryComparison = secondaryFieldA - secondaryFieldB;
            return secondaryComparison * modifier;
          }
        })
      : filtedCashData?.sort((a, b) => (a[field] - b[field]) * modifier);

  return { sortedCashData, isPending };
}
