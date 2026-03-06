import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNotification } from '../../hooks';
import { LS_ACT } from '../../constants/auth';
import {
  type AppDispatch,
  useSelector
} from '../../store/store';
import { selectUser } from '../../slices/user-slice';
import { logoutThunk } from '../../slices/auth-slice';
import { ENotificationPermissions } from '../../enums';

const TS_MIN = 60000;
const TS_MAX = 70000;
const IDLE_LIMIT = 5;
const MIN_IDLE_LIMIT = 2;
const INTERVAL = 10000;
const EVENTS = ['click', 'load', 'scroll', 'mousemove'];

type Props = {
  eventsList?: string[]
  idleLimit?: number
  interval?: number
}

export const IdleObserver: React.FC<Props> = ({
  eventsList = EVENTS,
  idleLimit = IDLE_LIMIT,
  interval = INTERVAL,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
	const { permission, requestPermission, isSupported, showNotification } = useNotification();

	const [events] = useState(eventsList);

	let intervalId: NodeJS.Timer;

  const idle = idleLimit < MIN_IDLE_LIMIT ? MIN_IDLE_LIMIT : idleLimit;

	const getCurrentTimestamp = () => localStorage.setItem(LS_ACT, String(new Date().getTime()));

	const clearSubscribes = () => {
		clearInterval(intervalId);

		events.forEach((event) => {
			window.removeEventListener(event, getCurrentTimestamp);
		});
	};

	useEffect(() => {
		if (user) {
      getCurrentTimestamp();

			events.forEach((event) => {
				window.addEventListener(event, getCurrentTimestamp);
			});

      intervalId = setInterval(() => {
				const lastActivityTimestamp = Number(localStorage.getItem(LS_ACT)) || 0;
				const currentTimestamp = new Date().getTime();
        const delta = currentTimestamp - lastActivityTimestamp;
        const idleMs = TS_MIN * idle;

        if ((delta >= (idleMs - TS_MAX)) && (delta < (idleMs - TS_MIN))) {
          showNotification({
            title: 'Flip 7',
            icon: '../../../public/logo.jpg',
            body: 'Выход из профиля произойдет через 1 минуту',
            silent: true,
            onNotificationClick: () => null,
            onNotificationError: () => null,
          });
        }

				if (delta > idleMs) {
          dispatch(logoutThunk());
				}
			}, interval);

      if (isSupported && permission === ENotificationPermissions.default) {
        requestPermission().then();
      }
		} else {
			clearSubscribes();
		}

		return clearSubscribes;
	}, [user]);

	return (<></>);
};
