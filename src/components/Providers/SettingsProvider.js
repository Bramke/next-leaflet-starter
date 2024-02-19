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
      donkey: false,
      bluebike: false,
    },
    publicTransit: {
      delijn: true,
      nmbs: true,
      eurolines: false,
      flixbus: false,
      flibco: false
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

  const { error } = useGeolocated();

  useEffect(() => {
    if (error) {
      console.error('Error getting user location:', error);
    }
  }, [error]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
