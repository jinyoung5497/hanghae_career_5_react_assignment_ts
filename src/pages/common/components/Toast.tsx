import { useToastStore } from '@/store_zustand/toast/toastStore';
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  const { isToast, setIsToast } = useToastStore();

  useEffect(() => {
    if (isToast) {
      const timer = setTimeout(() => {
        setIsToast();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isToast, setIsToast]);

  if (!isToast) return null;

  return (
    <div className="bg-black p-4 rounded-lg bg-opacity-70">
      <div className="text-white ">{message}</div>
    </div>
  );
};

export default Toast;
