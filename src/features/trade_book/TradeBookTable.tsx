import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getTradeBookData } from "../../services/apiTradeBook";

import Spinner from "../../ui/Spinner";
import TradeBookRow from "./TradeBookRow";

const Table = styled.div`
  width: 100%;
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  background-color: var(--color-grey-200);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-800);
  padding: 1.6rem 2.4rem;
`;

function TradeBookTable() {
  const {
    isPending,
    data: TradeBook,
    error,
  } = useQuery({
    queryKey: ["trade_book"],
    queryFn: getTradeBookData,
  });

  if (isPending) {
    <Spinner />;
  }

  if (error) throw new Error(error.message);

  return (
    <Table role="table">
      <TableHeader role="row">
        <div>Stock</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Date</div>
        <div>Member</div>
        <div>Remark</div>
      </TableHeader>
      {TradeBook?.map((data) => (
        <TradeBookRow TradeBook={data} key={data.id} />
      ))}
    </Table>
  );
}

export default TradeBookTable;
