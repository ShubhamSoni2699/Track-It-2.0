import styled from 'styled-components';
import Table from '../../ui/Table';


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

function CashTopCreditRow({ TransectionData }) {
  const { member_name, amount, credit_debit, date, remark, tag } =
    TransectionData;
  return (
    <Table.Row type={credit_debit === 'cr' ? true : false} isPadding={false}>
      <Name>{member_name}</Name>
      <Amount>{amount}</Amount>
      <Type>{credit_debit}</Type>
      <Date>{date}</Date>
      <Remark>{remark}</Remark>
      <Tag>{tag}</Tag>
    </Table.Row>
  );
}

export default CashTopCreditRow;
