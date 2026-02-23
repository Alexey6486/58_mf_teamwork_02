import { useEffect, useState } from 'react';
import { LS_KEY } from '../constants/auth';

export const useIsAuthed = () => {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem(LS_KEY);
      setIsAuthed(!!user);
    };

    checkAuth();
  }, []);

  return { isAuthed };
};
