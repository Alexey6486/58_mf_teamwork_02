import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  URL_BASE,
  URL_USER_DATA
} from '../constants/urls';
import { ERequestMethods } from '../enums';
import {
  type AppDispatch,
  useSelector
} from '../store/store';
import {
  selectUser,
  setUsers
} from '../slices/user-slice';
import { safeJsonParse } from '../utils';

export const useIsAuthed = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await fetch(`${URL_BASE}${URL_USER_DATA}`, {
          method: ERequestMethods.GET,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' as RequestCredentials,
        });

        if (userData.ok) {
          setIsAuthed(true);
          setIsLoading(false);
          const data = await safeJsonParse(userData);
          dispatch(setUsers(data));
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
      }
    };

    if (!user) {
      checkAuth().then();
    } else {
      setIsAuthed(true);
      setIsLoading(false);
    }
  }, []);

  return { isAuthed, isLoading };
};
