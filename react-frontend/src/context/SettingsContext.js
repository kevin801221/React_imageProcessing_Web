import React, { createContext, useState, useEffect } from 'react';
import { settingsApi } from '../services/api';

export const SettingsContext = createContext();

// useSettings is now moved to a separate hook file

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsApi.getSettings();
        if (response.data.success) {
          setSettings(response.data.settings);
        }
      } catch (err) {
        setError('Failed to load settings');
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      setLoading(true);
      const response = await settingsApi.updateSettings(newSettings);
      if (response.data.success) {
        setSettings(newSettings);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      setError('Failed to update settings');
      console.error('Error updating settings:', err);
      return { success: false, message: 'Failed to update settings' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
};
