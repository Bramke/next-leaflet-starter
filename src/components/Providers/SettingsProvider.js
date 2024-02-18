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
      donkey: true,
      bluebike: true,
    },
    publicTransit: {
      delijn: true,
      nmbs: true,
      eurolines: true,
      flixbus: true,
      flibco: true
    }

  };
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;

