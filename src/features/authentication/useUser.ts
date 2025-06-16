import { useQuery } from '@tanstack/react-query';
// Assuming getUser is an asynchronous function that fetches user data.
// You'll need to define the return type of getUser as well.
import { getUser } from '../../services/apiAuth'; // Adjust the import path as needed

// 1. Define the type for the user data.
// Adjust this interface based on the actual structure of your user object.
interface User {
  id: string; // Example property
  email: string; // Example property
  role: string // Example property with specific literal types
  fullName?: string; // Example optional property
  // Add other properties that your user object might have
}

export function useUser() {
  const { isLoading, data: user } = useQuery<User>({ // Type annotation for useQuery
    queryKey: ['user'],
    queryFn: getUser, // getUser should return Promise<User>
  });

  return { isLoading, user, isAuthenticated: user?.role === 'authenticated' };
}