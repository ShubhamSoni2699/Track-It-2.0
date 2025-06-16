import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import { useForm } from 'react-hook-form';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useMembersData } from '../../hooks/useMembersData';
import { useTags } from '../../hooks/useTags';
import { useMutateTransection } from './useMutateTransection';

const StyleContainerMain = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(var(--blur-sm));
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StyleContainerLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: auto;
`;

const StyledFormLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  width: 100%;
  padding: 15px;
  background-color: ${(props) => (props.$isCredit ? 'var(--color-profit)' : 'var(--color-loss)')};
  border-radius: 15px;
`;

StyledFormLayout.defaultProps = {
  isBuying: true,
};

const StyledHeading = styled.h1`
  text-align: center;
  font-weight: bold;
  font-size: larger;
  margin-bottom: 10px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StyledContainerFormElement = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const StyledInput = styled.input`
  width: 120px;
  background-color: var(--color-grey-50);
  border-radius: 20px;
  padding: 10px;

  &::placeholder {
    text-align: center;
  }
  &:focus {
    outline: auto;
    outline-color: black;
    outline-offset: 1px;
  }
`;

const StyledSeletion = styled.select`
  width: 120px;
  background-color: var(--color-grey-50);
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 20px;
  &::placeholder {
    text-align: center;
  }
  &:focus {
    outline: auto;
    outline-color: black;
  }
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 2px;
  gap: 5px;
`;

const StyledButton = styled.button`
  width: 50%;
  padding: 10px;
  &:focus {
    outline-color: black;
    outline-offset: 1px;
  }
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
`;

const StyledLabel = styled.label`
  font-size: large;
  margin-bottom: 10px;
`;

function CashModal({ setShowModal, isCredit }) {

  const { isPending, Members } = useMembersData();
  const { isPending: isPendingTag, Tags } = useTags(isCredit);
  
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  const { isCreatingTransection, mutateTransection } =
    useMutateTransection(reset);

  function onSubmit(data) {
    const row = {
      ...data,
      credit_debit: isCredit ? 'cr' : 'dr',
    };
    mutateTransection(row);
  }

  function onError(error) {
    console.log(error);
  }

  if (isPending || isPendingTag) <Spinner />;

  const ref = useOutsideClick(setShowModal);

  return (
    <StyleContainerMain>
      <StyleContainerLayout ref={ref}>
        <StyledFormLayout $isCredit={isCredit}>
          <StyledHeading>Transaction Details</StyledHeading>
          <StyledForm onSubmit={handleSubmit(onSubmit, onError)}>
            <StyledContainerFormElement>
              <StyledInputContainer>
                <StyledLabel>Member</StyledLabel>
                <StyledSeletion
                  name="members"
                  id="member_name"
                  {...register('member_name', {
                    required: 'This Field can not be empty!!',
                  })}
                  required
                >
                  {Members?.map((member) => (
                    <option value={member.Name} key={member.Name}>
                      {member.Name}
                    </option>
                  ))}
                </StyledSeletion>
              </StyledInputContainer>
              <StyledInputContainer>
                <StyledLabel>Amount</StyledLabel>
                <StyledInput
                  type="number"
                  placeholder="Amount"
                  step="0.01"
                  id="amount"
                  {...register('amount', {
                    required: 'This Field can not be empty!!',
                  })}
                  required
                />
              </StyledInputContainer>
              <StyledInputContainer>
                <StyledLabel>Date</StyledLabel>
                <StyledInput
                  type="date"
                  placeholder="Date"
                  id="date"
                  {...register('date', {
                    required: 'This Field can not be empty!!',
                  })}
                  required
                />
              </StyledInputContainer>
              <StyledInputContainer>
                <StyledLabel>Remark</StyledLabel>
                <StyledInput
                  type="text"
                  placeholder="Remark"
                  id="remark"
                  {...register('remark', {
                    required: 'This Field can not be empty!!',
                  })}
                  required
                />
              </StyledInputContainer>
              <StyledInputContainer>
                <StyledLabel>Category</StyledLabel>
                <StyledSeletion
                  name="tag"
                  id="tag"
                  {...register('tag', {
                    required: 'This Field can not be empty!!',
                  })}
                  required
                >
                  {Tags?.map((tag) => (
                    <option value={tag.Name} key={tag.Name}>
                      {tag.Name}
                    </option>
                  ))}
                </StyledSeletion>
              </StyledInputContainer>
            </StyledContainerFormElement>
            {errors?.Name?.message && <Error>{errors.Name.message}</Error>}
            <StyledButtonContainer>
              <StyledButton
                type="submit"
                className="bg-violet-500 rounded-2xl uppercase focus:outline-none"
                disabled={isCreatingTransection}
              >
                Add
              </StyledButton>
              <StyledButton
                onClick={() => setShowModal(false)}
                className="bg-stone-700 rounded-2xl uppercase"
              >
                Close
              </StyledButton>
            </StyledButtonContainer>
          </StyledForm>
        </StyledFormLayout>
      </StyleContainerLayout>
    </StyleContainerMain>
  );
}

export default CashModal;
