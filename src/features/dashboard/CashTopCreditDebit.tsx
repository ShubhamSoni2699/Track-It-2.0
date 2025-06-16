import styled from 'styled-components';
import Heading from '../../ui/Heading';
import { useFilterAndSort } from '../cash/useFilterAndSort';
import Table from '../../ui/Table';
import CashTopCreditRow from '../cash/CashTopCreditRow';

const ContainerBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 1 / span 4;
  display: flex;
  flex-direction: row;
  justify-content:space-between;
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

const Container =  styled.div`
  width: 50%;
  margin: 0%;
  flex-direction: column;
`;

function CashTopTransaction() {
  const { filtedCashData, isPending: isPendingsortedCashData } =
    useFilterAndSort(false , 'current-month');

  const transactionData = filtedCashData
    ? filtedCashData
      .sort((a, b) => b.amount - a.amount)
    : null;

  const creditTransactionData = transactionData?.filter((data)=> data.credit_debit ==='cr').slice(0,5);
  const debitTransactionData = transactionData?.filter((data)=> data.credit_debit ==='dr').slice(0,5);

  return (
    <ContainerBox>
      <Container>
      <Heading as="h2" $isPadding={true}>Top Credit Amount (₹)</Heading>
       <Table columns={'0.25fr 0.25fr 0.25fr 0.25fr 0.25fr 0.25fr'}>
      <Table.Header isPadding={false}>
        <div>Member</div>
        <div>Amount</div>
        <div>Type</div>
        <div>Date</div>
        <div>Remark</div>
        <div>Tag</div>
      </Table.Header>
      {!isPendingsortedCashData && (
        <Table.Body
          data={
            creditTransactionData
          }
          render={(data) => <CashTopCreditRow TransectionData={data} key={data.id} />}
        />
      )}
    </Table>
      </Container>
      <Container>
      <Heading as="h2" $isPadding={true}>Top Debit Amount (₹)</Heading>
      <Table columns={'0.25fr 0.25fr 0.25fr 0.25fr 0.25fr 0.25fr'}>
      <Table.Header isPadding={false}>
        <div>Member</div>
        <div>Amount</div>
        <div>Type</div>
        <div>Date</div>
        <div>Remark</div>
        <div>Tag</div>
      </Table.Header>
      {!isPendingsortedCashData && (
        <Table.Body
          data={
            debitTransactionData
          }
          render={(data) => <CashTopCreditRow TransectionData={data} key={data.id} />}
        />
      )}
    </Table>
      </Container>
    </ContainerBox>
  );
}

export default CashTopTransaction;
