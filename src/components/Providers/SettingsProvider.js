import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const SettingsProvider = ({ children }) => {
  const defaultSettings = {
    isMicroMobilityMode: true,
    isPublicTransit: true,
    microMobilityMode: {
      dott: true,
      bolt: true,
      donkey: false,
      bluebike: false,
    },
    publicTransit: {
      delijn: true,
      nmbs: true,
      eurolines: false,
      flixbus: false,
      flibco: false
    },
    userLocation: {
      long: 51.05,
      lat: 3.71667,
    }

  };
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      if (Object.keys(parsedSettings).length > 0) {
        setSettings(parsedSettings);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      localStorage.setItem('settings', JSON.stringify(settings));
    }
  }, [settings]);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const location = {
            long: position.coords.longitude,
            lat: position.coords.latitude,
          };
          setSettings((prevSettings) => ({
            ...prevSettings,
            userLocation: location,
          }));
        }, (error) => {
          console.error('Error getting user location:', error);
        });
      } else {
        console.error('Geolocation is not supported by your browser.');
      }
    };

    getUserLocation();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
