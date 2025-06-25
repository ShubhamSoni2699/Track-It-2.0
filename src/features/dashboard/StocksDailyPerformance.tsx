import styled from 'styled-components';
import Heading from '../../ui/Heading';
import { useFilterAndSort } from '../stocks/useFilterAndSort';
import Table from '../../ui/Table';
import StocksDailyPerformanceRow from '../stocks/StocksDailyPerformanceRow';

const ContainerBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 1 / span 4;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2px;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
  & .recharts-default-legend {
    font-size: 12px !important;
  }
`;

const Container = styled.div`
  width: 100%;
  margin: 0%;
  flex-direction: column;
`;

function StocksDailyPerformance() {
  const { sortedEquityData, isPending } = useFilterAndSort();
  const sortingFiled = 'ltp_change_percent';

  let sortedPerformanceData;

  if (!isPending) {
    sortedPerformanceData = sortedEquityData?.sort((a, b) => {
      return (a[sortingFiled] - b[sortingFiled]) * -1;
    });
    console.log(sortedPerformanceData);
  }

  return (
    <ContainerBox>
      <Container>
        <Heading as="h2" $isPadding={true}>
          Stocks Performance Today
        </Heading>
        <Table columns={'0.25fr 0.25fr 0.25fr 0.25fr 0.25fr'}>
          <Table.Header isPadding={false}>
            <div>Ticker</div>
            <div>Quantity</div>
            <div>Todays Change</div>
            <div>Todays Total</div>
            <div>Todays Change %</div>
          </Table.Header>
          {!isPending && (
            <Table.Body
              data={sortedPerformanceData}
              render={(data) => (
                <StocksDailyPerformanceRow Data={data} key={data.ticker} />
              )}
            />
          )}
        </Table>
      </Container>
    </ContainerBox>
  );
}

export default StocksDailyPerformance;
