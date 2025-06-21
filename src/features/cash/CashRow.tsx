import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Modal from '../../ui/Modal';
import Table from '../../ui/Table';
import { useCashSummary } from './useCashSummary';
import { useDeleteLastTransecion } from './useDeleteLastTransection';
import { useLastestTransectionId } from './useLastestTransectionId';

const Type = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-700);
  font-family: 'Sono';
`;

const Amount = styled.div`
  font-family: 'Sono';
  font-weight: 600;
  color: var(--color-grey-700);
`;

const Name = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Date = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Remark = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Tag = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Button = styled.button`
  background-color: var(--color-red-700);
  border-radius: calc(infinity * 1px);
  &:focus {
    outline: auto;
    outline-color: black;
    outline-offset: 1px;
  }
`;

const StyledPerCapital = styled.div`
  background-color: var(--color-grey-50);
  border-radius: calc(infinity * 1px);
  text-align: center;
`;

function CashRow({ TransectionData }) {
  const { id, member_name, amount, credit_debit, date, remark, tag } =
    TransectionData;

  const { isDeleting, mutate } = useDeleteLastTransecion();
  const { isPending: isPendingLatestId, dataLatestId } =
    useLastestTransectionId();
  const { isPending: isPendingCashSummary, CashSummary } = useCashSummary();

  return (
    <Table.Row type={credit_debit === 'cr' ? true : false}>
      <Name>{member_name}</Name>
      <Amount>{amount}</Amount>
      <Type>{credit_debit}</Type>
      <Date>{date}</Date>
      <Remark>{remark}</Remark>
      <Tag>{tag}</Tag>
      {isPendingLatestId ? (
        <Spinner />
      ) : id === dataLatestId.id ? (
        <Modal>
          <Modal.Open opens="delete">
            <Button>Remove</Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName={'Transection'}
              disabled={isDeleting}
              onConfirm={() => mutate(id)}
            />
          </Modal.Window>
        </Modal>
      ) : isPendingCashSummary ? (
        ''
      ) : (
        <StyledPerCapital>
          {Math.round((amount / CashSummary[0].net_balance) * 100 * 100) / 100}%
        </StyledPerCapital>
      )}
    </Table.Row>
  );
}

export default CashRow;
