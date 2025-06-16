import { useQuery } from '@tanstack/react-query';
import { getMembersData } from '../services/apiFamilyMember';

export function useMembersData() {
  const {
    isPending,
    data: Members,
    error,
  } = useQuery({
    queryKey: ['members'],
    queryFn: getMembersData,
  });

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { isPending, Members };
}
