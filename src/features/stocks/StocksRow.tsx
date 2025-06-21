import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';
import getLTP from '../../services/apiGetLTP';
import { getTicker, setLTP } from '../../services/apiEquity';
import toast from 'react-hot-toast';
import Table from '../../ui/Table';

const Ticker = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-700);
  font-family: 'Sono';
`;

const Price = styled.div`
  width: fit-content;
  font-family: 'Sono';
  font-weight: 600;
  color: var(--color-grey-700);
  background-color: ${(props) =>
    props.value === 1 ? 'var(--color-profit)' : props.value === 0 ? 'var(--color-loss)' : 'var(--color-grey-0)'};
  border-radius: 5px;
  padding-left:2px;
  padding-right: 2px;
`;
const ProfitLoss = styled.div`
  font-family: 'Sono';
  font-weight: 600;
  color: var(--color-grey-700);
`;

const PercentageChange = styled.div`
  font-family: 'Sono';
  font-weight: 600;
  color: var(--color-grey-700);
`;

const InvestedAmount = styled.div`
  font-family: 'Sono';
  font-weight: 700;
  color: var(--color-grey-700);
`;

const CurrentAmount = styled.div`
  font-family: 'Sono';
  font-weight: 700;
  color: var(--color-grey-700);
`;

const Quantity = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-grey-700);
`;

function StocksRow({ EquityData }) {
  const {
    ticker,
    buying_price: avg_buying_price,
    quantity,
    invested_amount,
    ltp: last_trading_price,
  } = EquityData;

  const [isPriceUpdated, setIsPriceUpdated] = useState(false);

  const {
    isPending: isPendingTicker,
    data: TickerData,
    error: errorTicker,
  } = useQuery({
    queryKey: ['portfolio_ticker'],
    queryFn: getTicker,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (data) => setLTP(data),
    onSuccess: () => {
      setIsPriceUpdated(true);
      console.log('Price Updated');
      queryClient.invalidateQueries({
        queryKey: ['Equity'],
      });
      queryClient.invalidateQueries({
        queryKey: ['Equity_Summary'],
      });
      queryClient.invalidateQueries({
        queryKey: ['Equity'],
      });
    },
    onError: (err) => {
      toast.err(err.message);
    },
  });

  const [pricesData, setPricesData] = useState({});

  if (errorTicker) {
    console.log(errorTicker.message);
  }

  if (!isPendingTicker) {
    const data = TickerData.map((ticker) => ({
      symbol: ticker.ticker,
      exchange: 'NSE',
    }));
    getLTP(setPricesData, data);
    if (Object.keys(pricesData).length !== 0 && !isPriceUpdated) {
      console.log("hi")
      mutate(pricesData);
      setIsPriceUpdated(true);
    }
  }

  const latestPrice =
    Object.keys(pricesData).length !== 0
      ? pricesData[`${ticker}`]
      : last_trading_price !== null
      ? last_trading_price
      : -1;

  const latestAmount = Math.round(latestPrice * quantity * 100) / 100;
  const latestProfitLoss = latestAmount - invested_amount;
  const lastestProfitLossRounded = Math.round(latestProfitLoss * 100) / 100;
  const latestProfitLossPer = (latestProfitLoss / invested_amount) * 100;
  const latestProfitLossPerRounded =
    Math.round(latestProfitLossPer * 100) / 100;

  return (
    <Table.Row>
      <Ticker>{ticker}</Ticker>
      <Quantity>{quantity}</Quantity>
      <Price>{avg_buying_price}</Price>
      <InvestedAmount>{invested_amount}</InvestedAmount>
      <Price
        value={
          latestPrice > last_trading_price
            ? 1
            : latestPrice < last_trading_price
            ? 0
            : -1
        }
      >
        {latestPrice}
      </Price>
      <CurrentAmount>{latestAmount}</CurrentAmount>
      <ProfitLoss>{lastestProfitLossRounded}</ProfitLoss>
      <PercentageChange>{latestProfitLossPerRounded}</PercentageChange>
    </Table.Row>
  );
}

export default StocksRow;
