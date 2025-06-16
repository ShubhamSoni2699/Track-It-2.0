import styled from 'styled-components';
import UpdatePasswordForm from '../features/authentication/UpdatePasswordForm';
import UpdateUserDataForm from '../features/authentication/UpdateUserDataForm';
import Heading from '../ui/Heading';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

function Account() {
  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <StyledContainer>
        <Heading as="h3">Update Profile</Heading>
        <UpdateUserDataForm />
      </StyledContainer>

      <StyledContainer>
        <Heading as="h3">Update Password</Heading>
        <UpdatePasswordForm />
      </StyledContainer>
    </>
  );
}

export default Account;
