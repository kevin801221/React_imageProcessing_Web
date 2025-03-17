import React, { createContext, useState, useEffect } from 'react';
import { settingsApi } from '../services/api';

export const SettingsContext = createContext();

// useSettings is now moved to a separate hook file

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000,
    ollama_url: 'http://localhost:11434/api/generate',
    ollama_model: 'gemma3:12b',
    ollama_temperature: 0.7
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        // 嘗試從本地存儲獲取設置
        const localSettings = localStorage.getItem('appSettings');
        if (localSettings) {
          const parsedSettings = JSON.parse(localSettings);
          setSettings(prevSettings => ({
            ...prevSettings,
            ...parsedSettings
          }));
          setLoading(false);
          return;
        }
        
        // 如果本地沒有設置，嘗試從 API 獲取
        try {
          const response = await settingsApi.getSettings();
          if (response.data.success) {
            setSettings(prevSettings => ({
              ...prevSettings,
              ...response.data.settings
            }));
            
            // 保存到本地存儲
            localStorage.setItem('appSettings', JSON.stringify(response.data.settings));
          }
        } catch (apiErr) {
          console.log('API settings not available, using defaults');
          // 如果 API 不可用，使用默認設置並保存到本地
          localStorage.setItem('appSettings', JSON.stringify(settings));
        }
      } catch (err) {
        setError('無法載入設置');
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
      
      // 保存到本地存儲
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
      
      // 嘗試通過 API 更新設置（如果可用）
      try {
        const response = await settingsApi.updateSettings(newSettings);
        if (!response.data.success) {
          console.warn('API settings update failed, but local settings were updated');
        }
      } catch (apiErr) {
        console.log('API settings update not available, using local storage only');
      }
      
      setSettings(newSettings);
      return { success: true };
    } catch (err) {
      setError('更新設置失敗');
      console.error('Error updating settings:', err);
      return { success: false, message: '更新設置失敗' };
    } finally {
      setLoading(false);
    }
  };

  // 檢查 Ollama 服務是否可用
  const checkOllamaStatus = async () => {
    try {
      // 從 ollama_url 中提取基本 URL
      let ollamaBaseUrl = settings.ollama_url;
      
      // 移除所有路徑，只保留基本 URL（例如 http://localhost:11434）
      if (ollamaBaseUrl.includes('/api/generate')) {
        ollamaBaseUrl = ollamaBaseUrl.replace('/api/generate', '');
      } else if (ollamaBaseUrl.includes('/api')) {
        ollamaBaseUrl = ollamaBaseUrl.replace('/api', '');
      }
      
      // 確保 URL 沒有尾部斜線
      if (ollamaBaseUrl.endsWith('/')) {
        ollamaBaseUrl = ollamaBaseUrl.slice(0, -1);
      }
      
      console.log('Checking Ollama status at:', ollamaBaseUrl);
      
      // 使用 Ollama 的根端點檢查服務是否可用
      const response = await fetch(ollamaBaseUrl);
      const text = await response.text();
      
      // 如果回應包含 "Ollama is running"，則服務可用
      return text.includes('Ollama is running');
    } catch (err) {
      console.error('Error checking Ollama status:', err);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      loading, 
      error,
      checkOllamaStatus 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
