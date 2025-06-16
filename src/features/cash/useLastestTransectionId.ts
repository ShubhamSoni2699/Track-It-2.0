import { useQuery } from '@tanstack/react-query';
import { getLastestTransectionId } from '../../services/apiCash';

export function useLastestTransectionId() {
  const {
    data: dataLatestId,
    error,
    isPending,
  } = useQuery({
    queryKey: ['latest_id_cash'],
    queryFn: getLastestTransectionId,
  });

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { isPending, dataLatestId };
}
