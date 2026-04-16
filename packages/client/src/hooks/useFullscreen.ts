import { type RefObject, useCallback, useEffect, useState } from 'react';

interface UseFullscreenOptions {
  onEnter?: () => void;
  onExit?: () => void;
  onError?: (error: Error) => void;
}

export const useFullscreen = (
  elementRef: RefObject<HTMLElement>,
  options: UseFullscreenOptions = {}
) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Проверка поддержки API
    setIsSupported(!!document.fullscreenEnabled);
  }, []);

  const enter = useCallback(async () => {
    if (!elementRef.current || !isSupported) return;

    try {
      await elementRef.current.requestFullscreen();
      setIsFullscreen(true);
      options.onEnter?.();
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      options.onError?.(error as Error);
    }
  }, [elementRef, isSupported, options]);

  const exit = useCallback(async () => {
    if (!isSupported) return;

    try {
      await document.exitFullscreen();
      setIsFullscreen(false);
      options.onExit?.();
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
      options.onError?.(error as Error);
    }
  }, [isSupported, options]);

  const toggle = useCallback(() => {
    if (isFullscreen) {
      exit();
    } else {
      enter();
    }
  }, [isFullscreen, enter, exit]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, isSupported, enter, exit, toggle };
};
