import TableOperations from '../../ui/TableOperations';
import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';

function CashTableOperations({ isSort = false }) {
  return (
    <TableOperations>
      <Filter
        filterField={'filter'}
        options={[
          { value: 'all', label: 'All' },
          { value: 'current-month', label: 'This Month' },
          { value: 'last-month', label: 'Last Month' },
        ]}
        defalutOption = 'current-month'
      />
      {isSort && (
        <SortBy
          options={[
            { value: 'date-asc', label: 'Sort By Date (↑)' },
            { value: 'date-decs', label: 'Sort By Date (↓)' },
            { value: 'amount-asc', label: 'Sort By Amount (↑)' },
            { value: 'amount-decs', label: 'Sort By Amount (↓)' },
          ]}
          intialValue={'date-decs'}
        />
      )}
    </TableOperations>
  );
}

export default CashTableOperations;
