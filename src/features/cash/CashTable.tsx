import Spinner from '../../ui/Spinner';
import CashRow from './CashRow';
import Table from '../../ui/Table';
import Pagination from '../../ui/Pagination';
import { useFilterAndSort } from './useFilterAndSort';
import { useSearchParams } from 'react-router-dom';

// Define the type for a single cash transaction item

export default function CashTable() {
  // Specify the type for sortedCashData returned by useFilterAndSort
  const { isPending, sortedCashData }  = useFilterAndSort(true, 'current-month');
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  
  if (isPending) {
    return <Spinner />; // Return the Spinner component, not just render it
  }

   // Ensure currentPage is a number
  
  // Provide a default value for VITE_PAGE_SIZE in case it's not defined, and assert its type
  const pageSize: number = Number(import.meta.env.VITE_PAGE_SIZE || 10); // Default to 10 if not set

  // Ensure sortedCashData is not null or undefined before accessing its length
  const pageCount = Math.ceil((sortedCashData?.length || 0) / pageSize);

  // Determine the data to display based on pagination
  const paginatedData = sortedCashData ?
    (currentPage === pageCount
      ? sortedCashData.slice(
          (currentPage - 1) * pageSize,
          sortedCashData.length
        )
      : sortedCashData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )) : []; // Return an empty array if sortedCashData is null/undefined

  return (
    <Table columns={'1fr 1fr 0.5fr 1fr 1fr 1fr 1fr'}>
      <Table.Header>
        <div>Member</div>
        <div>Amount</div>
        <div>Type</div>
        <div>Date</div>
        <div>Remark</div>
        <div>Tag</div>
      </Table.Header>
      {/* No need for !isPending check here again, as we return Spinner if pending */}
      <Table.Body
        data={paginatedData}
        render={(data) => ( // Explicitly type 'data' in render prop
          <CashRow TransectionData={data} key={data.id} />
        )}
      />
      <Table.Footer>
        <Pagination count={sortedCashData?.length || 0} /> {/* Provide default for count */}
      </Table.Footer>
    </Table>
  );
}