import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateUser } from '../../services/apiAuth';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateCurrentUser, isLoading: isUpdaingCurentUser } =
    useMutation({
      mutationFn: updateUser,
      onSuccess: ({ user }) => {
        toast.success('User account successfully updated');
        queryClient.setQueryData(['user'], user);
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
      onError: (err) => toast.error(err.message),
    });

  return { updateCurrentUser, isUpdaingCurentUser };
}
