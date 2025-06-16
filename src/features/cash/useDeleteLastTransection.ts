import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCashData } from '../../services/apiCash';
import toast from 'react-hot-toast';

export function useDeleteLastTransecion() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate } = useMutation({
    mutationFn: deleteCashData,
    onSuccess: () => {
      toast.success('Transection deleted Successfuly');
      queryClient.invalidateQueries({
        queryKey: ['Cash'],
      });
      queryClient.invalidateQueries({
        queryKey: ['Cash_Summary'],
      });
      queryClient.invalidateQueries({
        queryKey: ['Daily_Cash_Summary'],
      });
    },
    onError: (err) => {
      toast.err(err.message);
    },
  });

  return { isDeleting, mutate };
}
