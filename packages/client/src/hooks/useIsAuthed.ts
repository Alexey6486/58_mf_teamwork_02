import { useEffect, useState } from 'react';
import {
  URL_BASE,
  URL_USER_DATA
} from '../constants/urls'
import { ERequestMethods } from '../enums'
import { useSelector } from '../store/store'
import { selectUser } from '../slices/user-slice'

export const useIsAuthed = () => {
  const user = useSelector(selectUser);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

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

        console.log({userData})
        if (userData.ok) {
          setIsAuthed(true);
        }
      } catch (e) {
        console.log({ e })
      }
    };

    if (!user) {
      checkAuth().then();
    } else {
      setIsAuthed(true);
    }
  }, []);

  return { isAuthed };
};
