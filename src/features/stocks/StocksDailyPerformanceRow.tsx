import styled from 'styled-components';
import Table from '../../ui/Table';

const TodaysChange = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-700);
  font-family: 'Sono';
`;

const Amount = styled.div`
  font-family: 'Sono';
  font-weight: 600;
  color: var(--color-grey-700);
`;

const Ticker = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Total = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-grey-700);
`;

function StocksDailyPerformanceRow({ Data }) {
  const { ticker, quantity, ltp_change, ltp_change_percent } = Data;
  return (
    <Table.Row type={ltp_change_percent>0?true:false}>
      <Ticker>{ticker}</Ticker>
      <Amount>{quantity}</Amount>
      <TodaysChange>{ltp_change}</TodaysChange>
      <Total>{Math.round(quantity * ltp_change * 100) / 100}</Total>
      <TodaysChange>{ltp_change_percent}</TodaysChange>
    </Table.Row>
  );
}

export default StocksDailyPerformanceRow;
