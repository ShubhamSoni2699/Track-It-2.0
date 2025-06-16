import { useNavigate } from 'react-router-dom';
import DashboardFilter from '../features/dashboard/DashboardFilter';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import styled, { css } from 'styled-components';
import DashboardLayoutCash from '../features/dashboard/DashboardLayoutCash'
import CashTableOperations from '../features/cash/CashTableOperations';

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

function DashboardCash() {
     const navigate = useNavigate(); // Get the navigate function
    
      const handleNavigateToDashboard = () => {
        navigate('/dashboard'); 
      };
    
      const handleNavigateToDashboardStocks = () => {
        navigate('/dashboard/dashboard-stocks'); // Call navigate with the desired path
      };
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">
          <StyledButtonPageContainer>
            <StyledButtonPage onClick={handleNavigateToDashboard} >Main Dashboard</StyledButtonPage>
            <StyledButtonPage  onClick={handleNavigateToDashboardStocks}>Stocks Dashboard</StyledButtonPage>
          </StyledButtonPageContainer>
          </Heading>
        <CashTableOperations/>
      </Row>
      <DashboardLayoutCash />
    </>
  );
}

export default DashboardCash;
