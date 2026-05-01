import React from 'react';
import { useGeolocation } from '../../hooks';
import { BTN_CLASS } from '../../constants/style-groups';
import { IconButton } from '../IconButton';
import { EIconButton } from '../../enums';

export const GeoLocation = () => {
  const {
    data: geoData,
    error: geoError,
    isLoading: geoLoading,
    isSupported: geoSupported,
    getLocation,
  } = useGeolocation();

  return (
    <div className="absolute bottom-6 left-6 z-10">
      {geoSupported && (
        <div className="w-full flex items-center">
          <IconButton
            iconName={EIconButton.GEO}
            onClick={getLocation}
            hoverName="Определить местоположение"
          />
          {geoLoading && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Определяем...
            </p>
          )}
          {geoData && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              {[geoData.city, geoData.country].filter(Boolean).join(', ')}
            </p>
          )}
          {geoError && (
            <p className="text-sm text-center text-red-500">{geoError}</p>
          )}
        </div>
      )}
    </div>
  );
};
