import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { registerUserAPI } from '@/api/auth';
import { IUser } from '@/types/authType';
import { RegisterUserReqDTO } from '@/api/dtos/authDTO';
import { useAuthStore } from '@/store_zustand/auth/authStore';

const useRegisterUser = (): UseMutationResult<
  IUser,
  Error,
  RegisterUserReqDTO
> => {
  const setUser = useAuthStore((state) => state.setUser);
  const setRegisterStatus = useAuthStore((state) => state.setRegisterStatus);
  const setRegisterError = useAuthStore((state) => state.setRegisterError);

  return useMutation({
    mutationFn: ({ email, password, name }: RegisterUserReqDTO) =>
      registerUserAPI({ email, password, name }),

    // 요청이 진행 중일 때 상태 업데이트
    onMutate: () => {
      setRegisterStatus('loading');
    },

    // 성공적으로 등록되었을 때 상태 업데이트
    onSuccess: (data) => {
      console.log('User registered successfully:', data);
      setUser(data); // 유저 정보를 저장
      setRegisterStatus('succeeded');
      setRegisterError(null); // 에러 초기화
    },

    // 오류가 발생했을 때 상태 업데이트
    onError: (error: Error) => {
      console.error('Error registering user:', error);
      setRegisterStatus('failed');
      setRegisterError(error.message || 'Registration failed'); // 에러 메시지 설정
    },
  });
};

export default useRegisterUser;
