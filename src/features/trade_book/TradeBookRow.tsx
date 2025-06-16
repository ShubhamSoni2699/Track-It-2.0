import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { deleteTradeBookData } from "../../services/apiTradeBook";
import toast from "react-hot-toast";

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Ticker = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-700);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
  color: var(--color-grey-700);
`;

const Quantity = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Date = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Name = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Remark = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-700);
`;

function TradeBookRow({ TradeBook }) {
  const {
    id,
    ticker,
    price,
    quantity,
    date,
    member_name,
    Remark: remark,
    isBuying,
  } = TradeBook;

  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate } = useMutation({
    mutationFn: deleteTradeBookData,
    onSuccess: () => {
      toast.success("Trade deleted Successfuly");
      queryClient.invalidateQueries({
        queryKey: ["trade_book"],
      });
    },
    onError: (err) => {
      toast.err(err.message);
    },
  });

  return (
    <TableRow className={isBuying ? "bg-green-200" : "bg-red-200"} role="row">
      <Ticker>{ticker}</Ticker>
      <Price>{price}</Price>
      <Quantity>{quantity}</Quantity>
      <Date>{date}</Date>
      <Name>{member_name}</Name>
      <Remark>{remark}</Remark>
      <button
        className="bg-red-400 p-3 rounded-full focus:outline-none"
        onClick={() => mutate(id)}
        disabled={isDeleting}
      >
        Remove
      </button>
    </TableRow>
  );
}

export default TradeBookRow;
