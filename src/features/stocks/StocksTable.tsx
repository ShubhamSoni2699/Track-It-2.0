import Spinner from '../../ui/Spinner';
import StocksRow from './StocksRow';
import Table from '../../ui/Table';
import { useFilterAndSort } from './useFilterAndSort';

function StocksTable() {
  const { sortedEquityData, isPending } = useFilterAndSort();

  if (isPending) {
    <Spinner />;
  }

  return (
    <Table columns={'1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'}>
      <Table.Header>
        <div>Stock</div>
        <div>Quantity</div>
        <div>Avg Price</div>
        <div>Invested</div>
        <div>LTP</div>
        <div>Current</div>
        <div>Proft/Loss</div>
        <div>% Change</div>
      </Table.Header>
      {!isPending && (
        <Table.Body
          data={sortedEquityData}
          render={(data) => <StocksRow EquityData={data} key={data.ticker} />}
        />
      )}
    </Table>
  );
}

export default StocksTable;
