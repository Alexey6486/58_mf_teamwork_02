import { useState } from 'react';

type GeolocationData = {
  city?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

type GeolocationState = {
  data: GeolocationData | null;
  error: string | null;
  isLoading: boolean;
};

export const useGeolocation = () => {
  const isSupported =
    typeof navigator !== 'undefined' && 'geolocation' in navigator;

  const [state, setState] = useState<GeolocationState>({
    data: null,
    error: null,
    isLoading: false,
  });

  const getLocation = () => {
    if (!isSupported) {
      setState(prev => ({
        ...prev,
        error: 'Геолокация не поддерживается браузером',
      }));
      return;
    }

    setState({ data: null, error: null, isLoading: true });

    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'ru' } }
          );
          const json = await response.json();
          setState({
            data: {
              latitude,
              longitude,
              city:
                json.address?.city ??
                json.address?.town ??
                json.address?.village,
              country: json.address?.country,
            },
            error: null,
            isLoading: false,
          });
        } catch {
          setState({
            data: { latitude, longitude },
            error: null,
            isLoading: false,
          });
        }
      },
      error => {
        setState({ data: null, error: error.message, isLoading: false });
      }
    );
  };

  return { ...state, isSupported, getLocation };
};
