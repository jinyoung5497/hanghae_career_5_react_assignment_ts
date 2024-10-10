import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store_zustand/auth/authStore';
import { IUser } from '@/types/authType';
import { registerUserAPI } from '@/api/auth';
import { RegisterUserReqDTO } from '@/api/dtos/authDTO';

export const useRegisterUser = () => {
  const { setUser, setIsLogin } = useAuthStore();
  return useMutation<IUser, Error, RegisterUserReqDTO>({
    mutationFn: async (userData: RegisterUserReqDTO) => {
      return await registerUserAPI(userData);
    },
    onSuccess: (user) => {
      setUser(user);
      setIsLogin(true);
    },
    onError: (error) => {
      console.error('Registration failed:', error.message);
    },
  });
};
