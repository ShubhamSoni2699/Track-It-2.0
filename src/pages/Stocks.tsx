import { NavLink } from 'react-router-dom';
import Row from '../ui/Row';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import StocksModal from '../features/stocks/StocksModal';
import StocksTable from '../features/stocks/StocksTable';
import { useState } from 'react';
import { useEquitySummaryData } from '../features/stocks/useEquitySummaryData';
import EquityTableOperations from '../features/stocks/EquityTableOperations';
import StatsStocks from '../features/stocks/StatsStocks';

const StyledButtonPageContainer = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const StyledButtonPage = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.$active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledFooter = styled.footer`
  margin-top: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const StyledNavLink = styled(NavLink)`
  border: 1px solid var(--color-grey-200);
  font-size: 1.8rem;
  background-color: var(--color-brand-200);
  border-radius: 7px;
  padding: 0.5rem;
  overflow: hidden;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledButton = styled.button`
  width: 50%;
  padding: 5px;
  background-color: ${(props) =>
    props.$isBuying ? 'var(--color-profit)' : 'var(--color-loss)'};
  &:focus {
    outline-color: black;
  }
`;

const StyledAmountContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: fit-content;
  border-radius: 15px;
  padding: 8px;
  background-color: #b9f8cf;
`;

const StyledHeadingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const StyledNavigateButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

function Stocks() {
  const navigate = useNavigate(); // Get the navigate function

  const handleNavigateToTradeBook = () => {
    navigate('/stocks/tradebook'); // Call navigate with the desired path
  };

  const [showModal, setShowModal] = useState(false);
  const [isBuying, setIsBuying] = useState(true);

  const {
    isPending: isPendingEquitySummary,
    error: errorEquitySummary,
    EquitySummary,
  } = useEquitySummaryData();

  if (errorEquitySummary) {
    console.log(errorEquitySummary.message);
  }

  return (
    <>
      <StyledHeadingContainer>
        {!isPendingEquitySummary ? (
          <StatsStocks
            stocksCurrentAmount={EquitySummary[0].total_current_amount}
            stockInvestedAmount={EquitySummary[0].total_invested_amount}
            stockProfitLossToday={EquitySummary[0].today_profit_loss}
            sotckProfitLossPerToday={
              EquitySummary[0].today_profit_loss_percentage
            }
          />
        ) : (
          ''
        )}
      </StyledHeadingContainer>
      <StyledNavigateButtonContainer>
        <StyledButtonPageContainer>
          <StyledButtonPage onClick={handleNavigateToTradeBook}>
            Trade Book
          </StyledButtonPage>
        </StyledButtonPageContainer>
        <EquityTableOperations />
      </StyledNavigateButtonContainer>
      <StocksTable />
      <Row>
        <StyledButtonContainer>
          <StyledButton
            onClick={() => {
              setShowModal(true);
              setIsBuying(true);
            }}
            $isBuying={true}
            className="rounded-2xl uppercase"
          >
            Add
          </StyledButton>
          <StyledButton
            onClick={() => {
              setShowModal(true);
              setIsBuying(false);
            }}
            $isBuying={false}
            className="rounded-2xl uppercase"
          >
            EXIT
          </StyledButton>
        </StyledButtonContainer>
      </Row>
      {showModal && (
        <StocksModal setShowModal={setShowModal} isBuying={isBuying} />
      )}
    </>
  );
}

export default Stocks;
