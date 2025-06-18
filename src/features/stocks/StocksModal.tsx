import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { getMembersData } from '../../services/apiFamilyMember';
import Spinner from '../../ui/Spinner';
import { useForm } from 'react-hook-form';
import { setTradeBookData } from '../../services/apiTradeBook';
import toast from 'react-hot-toast';
import { onSellEquity, upsertEquityData } from '../../services/apiEquity';
import searchSymbol from '../../services/searchSymbol';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useState } from 'react';

// const URL = "https://api.twelvedata.com/symbol_search?symbol=";

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
  background-color: ${(props) => (props.isbuying ? 'var(--color-profit)' : 'var(--color-loss)')};
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

function StocksModal({ setShowModal, isBuying }) {
  const [tickerSearch, setTickerSearch] = useState('');

  const handleTickerChange = (event) => {
    setTickerSearch(event.target.value);
  };

  const {
    isPending: isPendingSymbol,
    data: symbolData,
    error: symbolError,
  } = useQuery({
    queryKey: ['symbol_data'],
    queryFn: async () => {
      const sData = await searchSymbol('nse', tickerSearch);
      return sData;
    },
  });

  if (isPendingSymbol) {
    <Spinner />;
  }

  if (symbolError) {
    toast.err('Stock list not loaded');
    throw new Error('Not getting symbols from list');
  }

  const {
    isPending,
    data: Members,
    error,
  } = useQuery({
    queryKey: ['members'],
    queryFn: getMembersData,
  });

  const { register, handleSubmit, reset, formState } = useForm({defaultValues: {
      member_name: Members?.[0]?.Name ?? '',
    },});
  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate: mutateStock } = useMutation({
    mutationFn: upsertEquityData,
    onSuccess: () => {
      toast.success('Stock update Successfuly');
      queryClient.invalidateQueries({
        queryKey: ['Equity'],
      });
    },
  });

  const { mutate: mutateStockOnSell } = useMutation({
    mutationFn: onSellEquity,
    onSuccess: () => {
      toast.success('Stock exited Successfuly');
      queryClient.invalidateQueries({
        queryKey: ['Equity'],
      });
    },
  });

  const { isPending: isCreatingTradeBook, mutate: mutateTradeBook } =
    useMutation({
      mutationFn: setTradeBookData,
      onSuccess: (data) => {
        toast.success('Trade created Successfuly');
        isBuying ? mutateStock(data) : mutateStockOnSell(data);
        queryClient.invalidateQueries({
          queryKey: ['trade_book'],
        });
        reset();
      },
      onError: (err) => {
        toast.err(err.message);
      },
    });

  function onSubmit(data) {
    const row = { ...data, isBuying };
    mutateTradeBook(row);
  }

  function onError(error) {
    console.log(error);
  }

  if (isPending) <Spinner />;
  if (error) console.log(error.message);

  const ref = useOutsideClick(setShowModal);

  return (
    <StyleContainerMain>
      <StyleContainerLayout ref={ref}>
        <StyledFormLayout isbuying={isBuying}>
          <StyledHeading>Trade Details</StyledHeading>
          <StyledForm onSubmit={handleSubmit(onSubmit, onError)}>
            <StyledContainerFormElement>
              <StyledInputContainer>
                <StyledLabel>Ticker</StyledLabel>
                <StyledInput
                  type="text"
                  placeholder="Ticker"
                  id="ticker"
                  list="symbols"
                  onKeyUp={handleTickerChange}
                  {...register('ticker', {
                    required: 'This Field can not be empty!!',
                  })}
                  autoComplete="on"
                  required
                />
                <datalist id="symbols">
                  {symbolData?.map((symbol) => (
                    <option value={symbol} key={symbol}>
                      {symbol}
                    </option>
                  ))}
                </datalist>
              </StyledInputContainer>
              <StyledInputContainer>
                <StyledLabel>Quantity</StyledLabel>
                <StyledInput
                  type="number"
                  placeholder="Quantity"
                  id="quantity"
                  {...register('quantity', {
                    required: 'This Field can not be empty!!',
                    min: {
                      value: 1,
                      message: 'Quantity should be atleast 1',
                    },
                  })}
                  required
                />
              </StyledInputContainer>
              <StyledInputContainer>
                <StyledLabel>Stock Price</StyledLabel>
                <StyledInput
                  type="number"
                  placeholder="Price"
                  id="price"
                  step="0.01"
                  {...register('price', {
                    required: 'This Field can not be empty!!',
                    min: {
                      value: 1,
                      message: 'Price should be positive',
                    },
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
                <StyledLabel>Member</StyledLabel>
                <StyledSeletion
                  {...register('member', {
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
            </StyledContainerFormElement>
            {errors?.Name?.message && <Error>{errors.Name.message}</Error>}
            <StyledButtonContainer>
              <StyledButton
                type="submit"
                className="bg-violet-500 rounded-2xl uppercase focus:outline-none"
                disabled={isCreatingTradeBook}
              >
                {isBuying ? 'ADD' : 'EXIT'}
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

export default StocksModal;
