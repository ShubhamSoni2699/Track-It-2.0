import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup as signupApi } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useSignup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: signup, isLoading: isLoadingSignup } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      toast.success('Signup Successful , Now Verify Your email');
      queryClient.setQueryData(['user'], user.user);
      navigate('/login', { replace: true });
    },
    onError: (err) => {
      toast.error('Signup Failed');
      console.log(err.message);
    },
  });

  return { signup, isLoadingSignup };
}
