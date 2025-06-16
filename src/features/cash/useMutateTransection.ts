import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setCashData } from '../../services/apiCash';
import toast from 'react-hot-toast';

export function useMutateTransection(reset) {
  const queryClient = useQueryClient();

  const { isPending: isCreatingTransection, mutate: mutateTransection } =
    useMutation({
      mutationFn: setCashData,
      onSuccess: () => {
        toast.success('Transaction created Successfuly');
        queryClient.invalidateQueries({
          queryKey: ['Cash'],
        });
        queryClient.invalidateQueries({
          queryKey: ['latest_id_cash'],
        });
        queryClient.invalidateQueries({
          queryKey: ['Cash_Summary'],
        });
        queryClient.invalidateQueries({
          queryKey: ['Daily_Cash_Summary'],
        });
        reset();
      },
      onError: (err) => {
        toast.err(err.message);
      },
    });

  return { isCreatingTransection, mutateTransection };
}
