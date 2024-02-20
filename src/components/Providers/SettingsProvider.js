import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGeolocated } from "react-geolocated";

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
      donkey: true,
      bluebike: false,
      bikeParking: true
    },
    publicTransit: {
      delijn: true,
      nmbs: true,
      eurolines: false,
      flixbus: false,
      flibco: false
    },
    themeMode: 'light'
  };

  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedSettings = localStorage.getItem('settings');
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } else {
      return defaultSettings;
    }
  });
  
  const resetToDefault = () => {
    setSettings(defaultSettings);
    window.location.reload();
  }

  useEffect(() => {
    const storedSettings = localStorage.getItem('settings');
    console.log('storedSettings', storedSettings)
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      console.log("setting default settings")
      localStorage.setItem('settings', JSON.stringify(defaultSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const { error } = useGeolocated();

  useEffect(() => {
    if (error) {
      console.error('Error getting user location:', error);
    }
  }, [error]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, resetToDefault }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
