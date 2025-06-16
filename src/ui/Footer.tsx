import styled from "styled-components";

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

function Footer({ children }) {
  return (
    <StyledContainer>
      <StyledFooter>{children}</StyledFooter>
    </StyledContainer>
  );
}

export default Footer;
