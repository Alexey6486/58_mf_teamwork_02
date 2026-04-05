import { useCallback, useEffect, useRef, useState } from 'react';
import { ENotificationPermissions } from '../enums';

const CL_MSG = {
  no_support: 'Notification Api не поддерживается',
  error_permission: 'Ошибка запроса разрешения уведомлений',
  error_show: 'Ошибка отображения уведомлений',
  permission_denied: 'Разрешение уведомлений не получено',
};

const TIMEOUT = 10000;

interface Props {
  title: string;
  body: string;
  icon?: string;
  silent?: boolean;
  onNotificationClick?: () => void;
  onNotificationError?: () => void;
}

export const useNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission>(ENotificationPermissions.default);
  const isSupported = 'Notification' in window;
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const notificationsRef = useRef<Set<Notification>>(new Set());

  const cleanupNotification = useCallback((notification: Notification) => {
    notification.onclick = null;
    notification.onerror = null;
    notification.close();
    notificationsRef.current.delete(notification);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.log(CL_MSG.no_support);
      return ENotificationPermissions.denied;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      return result;
    } catch (error) {
      console.error(CL_MSG.error_permission, error);
      return ENotificationPermissions.denied;
    }
  }, [isSupported]);

  const showNotification = useCallback(({
    title, body, icon, silent, onNotificationClick, onNotificationError,
  }: Props) => {
    if (!isSupported) {
      console.log(CL_MSG.no_support);
      return;
    }

    if (permission === ENotificationPermissions.granted) {
      try {
        const notification = new Notification(title, {
          body,
          icon,
          silent,
        });

        notificationsRef.current.add(notification);
        notification.onclose = () => {
          notificationsRef.current.delete(notification);
        };

        if (onNotificationClick) {
          notification.onclick = () => {
            window.focus();
            onNotificationClick();
          };
        }

        if (onNotificationError) {
          notification.onerror = () => onNotificationError();
        }

        const timeoutId = setTimeout(() => {
          cleanupNotification(notification);
          timeoutsRef.current.delete(timeoutId);
        }, TIMEOUT);

        timeoutsRef.current.add(timeoutId);
      } catch (error) {
        console.error(CL_MSG.error_show, error);

        if (onNotificationError) {
          onNotificationError();
        }
      }
    } else if (permission === ENotificationPermissions.default) {
      requestPermission().then(res => {
        if (res === ENotificationPermissions.granted) {
          showNotification({
            title,
            body,
            icon,
            silent,
            onNotificationClick,
            onNotificationError,
          });
        }
      });
    } else {
      console.warn(CL_MSG.permission_denied);
    }

    return;
  }, [cleanupNotification, isSupported, permission, requestPermission]);

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutsRef.current.clear();

      notificationsRef.current.forEach(notification => {
        notification.onclick = null;
        notification.onerror = null;
        notification.close();
      });
      notificationsRef.current.clear();
    };
  }, []);

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported,
  };
};
