import styled from "styled-components";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { NavLink } from "react-router-dom";

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

function ProfitAndLoss() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">ProfitAndLoss</Heading>
        <p>Filter/Sort</p>
      </Row>
      <StyledContainer>
        <StyledFooter>
          <StyledNavLink to={"/stocks/tradebook"}>Trade Book</StyledNavLink>
          <StyledNavLink to={"/stocks"}>Stocks</StyledNavLink>
          <StyledNavLink to={"/stocks/trading-journal"}>Journal</StyledNavLink>
        </StyledFooter>
      </StyledContainer>
    </>
  );
}

export default ProfitAndLoss;
