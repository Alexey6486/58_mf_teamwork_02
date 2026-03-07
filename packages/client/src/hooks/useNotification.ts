import { useCallback, useEffect, useState } from 'react';
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

        if (onNotificationClick) {
          notification.onclick = () => {
            window.focus();
            onNotificationClick();
          };
        }

        if (onNotificationError) {
          notification.onerror = onNotificationError;
        }

        setTimeout(() => notification.close(), TIMEOUT);
      } catch (error) {
        console.error(CL_MSG.error_show, error);

        if (onNotificationError) {
          onNotificationError();
        }
      }
    } else if (permission === ENotificationPermissions.default) {
      requestPermission().then(res => {
        if (res) {
          showNotification({ title, body, icon, onNotificationClick, onNotificationError });
        }
      });
    } else {
      console.warn(CL_MSG.permission_denied);
    }

    return;
  }, [isSupported, permission, requestPermission]);

  useEffect(() => {
    if (isSupported && permission) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported,
  };
};
