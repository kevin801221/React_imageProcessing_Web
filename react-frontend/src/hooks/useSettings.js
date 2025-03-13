import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

/**
 * Custom hook to access and update application settings
 * @returns {Object} Settings context with state and functions
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  return context;
};

export default useSettings;
