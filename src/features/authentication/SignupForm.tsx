import styled, { css } from 'styled-components';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import FormRowVertical from '../../ui/FormRowVertical';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSignup } from './useSignup';

// Email regex: /\S+@\S+\.\S+/

const StyledButtonSignup = styled.button`
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
  &:hover:not(:disabled) {
    background-color: var(--color-brand-200);
    color: red;
  }
`;

function SignupForm() {
  const navigate = useNavigate();
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  const { signup, isLoadingSignup } = useSignup();

  function onSubmit({ fullName, email, password }) {
    signup(
      { fullName, email, password },
      {
        onSettled: {
          reset,
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowVertical label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isLoadingSignup}
          {...register('fullName', { required: 'This field is required!' })}
        />
      </FormRowVertical>

      <FormRowVertical label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoadingSignup}
          {...register('email', {
            required: 'This field is required!',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Provide a valid Email Id',
            },
          })}
        />
      </FormRowVertical>

      <FormRowVertical
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isLoadingSignup}
          {...register('password', {
            required: 'This field is required!',
            minLength: {
              value: 8,
              message: 'Password must be atleast 8 Char Long',
            },
          })}
        />
      </FormRowVertical>

      <FormRowVertical
        label="Repeat password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isLoadingSignup}
          {...register('passwordConfirm', {
            required: 'This field is required!',
            validate: (value) =>
              value === getValues().password || 'Passwords need to match',
          })}
        />
      </FormRowVertical>

      <FormRowVertical>
        {/* type is an HTML attribute! */}
        <StyledButtonSignup disabled={isLoadingSignup}>
          Create new user
        </StyledButtonSignup>
      </FormRowVertical>
      <StyledP
        disabled={isLoadingSignup}
        onClick={() => {
          navigate('/login');
        }}
      >
        Login
      </StyledP>
    </Form>
  );
}

export default SignupForm;
