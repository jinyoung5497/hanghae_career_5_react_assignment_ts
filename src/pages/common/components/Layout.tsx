import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import { NavigationBar } from './NavigationBar';
import { useAuthStore } from '@/store_zustand/auth/authStore';
import Toast from './Toast';
import { useToastStore } from '@/store_zustand/toast/toastStore';
import Cookies from 'js-cookie';
import { auth } from '@/firebase';

export const authStatusType = {
  NEED_LOGIN: 'NEED_LOGIN',
  NEED_NOT_LOGIN: 'NEED_NOT_LOGIN',
  COMMON: 'COMMON',
};

interface LayoutProps {
  children: ReactNode;
  containerClassName?: string;
  authStatus?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  containerClassName = '',
  authStatus = authStatusType.COMMON,
}) => {
  const { isLogin, setIsLogin, setUser } = useAuthStore();
  const { message } = useToastStore();

  if (authStatus === authStatusType.NEED_LOGIN && !isLogin) {
    return <Navigate to={pageRoutes.login} />;
  }

  if (authStatus === authStatusType.NEED_NOT_LOGIN && isLogin) {
    return <Navigate to={pageRoutes.main} />;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const token = Cookies.get('accessToken');

      if (token && user) {
        // Verify the token with Firebase
        user
          .getIdTokenResult()
          .then((idTokenResult) => {
            // Check if the token is valid
            if (idTokenResult) {
              // If valid, set user state
              setUser({
                uid: user.uid,
                email: user.email ?? '',
                displayName: user.displayName ?? '',
              });
              setIsLogin(true);
            }
          })
          .catch((error) => {
            console.error('Token verification failed:', error);
            // Optionally, you can clear the cookie if token verification fails
            Cookies.remove('accessToken');
          });
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [setIsLogin, setUser]);

  return (
    <div>
      <div className="fixed left-1/2 flex right-10 z-[9999]">
        <Toast message={message} />
      </div>
      <NavigationBar />
      <div className="flex flex-col min-h-screen mt-24">
        <main className="flex-grow">
          <div className={`container mx-auto px-4 ${containerClassName}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
