import { useState } from 'react';
import CashTable from '../features/cash/CashTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import styled from 'styled-components';
import CashModal from '../features/cash/CashModal';
import CashTableOperations from '../features/cash/CashTableOperations';
import Stat from '../features/dashboard/Stat';
import { useCashSummary } from '../features/cash/useCashSummary';
import { formatCurrency } from '../utils/helpers';
import { HiOutlineCurrencyRupee } from 'react-icons/hi2';

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledButton = styled.button`
  width: 50%;
  padding: 5px;
  background-color: ${(props) =>
    props.$isCredit ? 'var(--color-profit)' : 'var(--color-loss)'};
  &:focus {
    outline-color: black;
  }
`;

function Cash() {
  const [showModal, setShowModal] = useState(false);
  const [isCredit, setIsCredit] = useState(true);

  const { isPending: isPendingCashSummary, CashSummary } = useCashSummary();

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">
          {!isPendingCashSummary && (
            <Stat
              title="Cash Balance"
              color={
                Number(CashSummary[0].net_balance) >= 350000 ? 'green' : 'red'
              }
              icon={<HiOutlineCurrencyRupee />}
              value={formatCurrency(CashSummary[0].net_balance)}
            />
          )}
        </Heading>
        <CashTableOperations isSort={true} />
      </Row>
      <Row>
        <CashTable />
      </Row>
      <Row>
        <StyledButtonContainer>
          <StyledButton
            onClick={() => {
              setShowModal(true);
              setIsCredit(true);
            }}
            $isCredit={true}
            className=" rounded-2xl uppercase"
          >
            Credit
          </StyledButton>
          <StyledButton
            onClick={() => {
              setShowModal(true);
              setIsCredit(false);
            }}
            $isCredit={false}
            className=" rounded-2xl uppercase"
          >
            Debit
          </StyledButton>
        </StyledButtonContainer>
      </Row>
      {showModal && (
        <CashModal setShowModal={setShowModal} isCredit={isCredit} />
      )}
    </>
  );
}

export default Cash;
