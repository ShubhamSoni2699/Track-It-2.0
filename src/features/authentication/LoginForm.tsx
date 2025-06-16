import { useState, FormEvent, ChangeEvent } from 'react'; // Import FormEvent and ChangeEvent
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import FormRowVertical from '../../ui/FormRowVertical';
import { useLogin } from './useLogin'; // This hook is assumed to be typed correctly
import SpinnerMini from '../../ui/SpinnerMini';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Define the props for StyledButtonLogin (transient prop $active)
interface StyledButtonLoginProps {
  $active?: boolean; // Using '$' prefix for transient props as per styled-components convention
}

const StyledButtonLogin = styled.button<StyledButtonLoginProps>`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.$active && // Accessing the typed prop
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 2rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

const StyledP = styled.p`
  color: red;
  width: fit-content;
  cursor: pointer; /* Added cursor pointer for clickable element */
  &:hover:not(:disabled) {
    background-color: var(--color-brand-200);
    color: red;
  }
`;

function LoginForm(): JSX.Element { // Explicitly define return type for component
  const [email, setEmail] = useState<string>(''); // Type useState with <string>
  const [password, setPassword] = useState<string>(''); // Type useState with <string>
  const { login, isLoadingLogin } = useLogin(); // Assuming useLogin returns { login: (data: { email: string, password: string }) => void; isLoadingLogin: boolean; }

  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>): void { // Type event as FormEvent<HTMLFormElement>
    e.preventDefault(); // Prevent default form submission behavior

    if (!email || !password) {
      // Optionally, add some user feedback here (e.g., a toast message)
      console.warn('Email and password are required.');
      return;
    }

    // Call the login mutation from useLogin hook
    login({ email, password });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} // Type event as ChangeEvent<HTMLInputElement>
          disabled={isLoadingLogin}
        />
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // Type event as ChangeEvent<HTMLInputElement>
          disabled={isLoadingLogin}
        />
      </FormRowVertical>
      <FormRowVertical>
        <StyledButtonLogin disabled={isLoadingLogin}>
          {!isLoadingLogin ? 'Log In' : <SpinnerMini />}
        </StyledButtonLogin>
        <StyledP
          onClick={() => {
            navigate('/signup');
          }}
        >
          Don't have an account, signup
        </StyledP>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;