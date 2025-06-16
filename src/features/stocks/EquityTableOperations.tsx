import TableOperations from '../../ui/TableOperations';
// import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';

function EquityTableOperations() {
  return (
    <TableOperations>
      {/* <Filter
        filterField={'filter'}
        options={[
          { value: 'all', label: 'All' },
          { value: 'current-month', label: 'This Month' },
          { value: 'last-month', label: 'Last Month' },
        ]}
      /> */}
      <SortBy
        options={[
          { value: 'current_amount-asc', label: 'Sort By Current Amount (↑)' },
          { value: 'current_amount-decs', label: 'Sort By Current Amount (↓)' },
          { value: 'profit_loss-asc', label: 'Sort By Profit (↑)' },
          { value: 'profit_loss-decs', label: 'Sort By Profit (↓)' },
          { value: 'per_change-asc', label: 'Sort By % Profit (↑)' },
          { value: 'per_change-decs', label: 'Sort By % Profit (↓)' },
        ]} intialValue={'current_amount-decs'}
      />
    </TableOperations>
  );
}

export default EquityTableOperations;
