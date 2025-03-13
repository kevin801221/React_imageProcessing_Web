import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import './SettingsPage.css';

const SettingsPage = () => {
  const { settings, updateSettings, loading, error } = useSettings();
  const [formData, setFormData] = useState({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000
  });
  const [saveStatus, setSaveStatus] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSaveStatus('saving');
    const result = await updateSettings(formData);
    
    if (result.success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('error');
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <div className="settings-page">
      <h1 className="page-title">設置</h1>
      
      <div className="settings-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <div>載入中...</div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="settings-section">
              <h2>API 設置</h2>
              
              <div className="form-group">
                <label htmlFor="apiKey">API Key</label>
                <div className="api-key-container">
                  <input 
                    type={showApiKey ? "text" : "password"} 
                    id="apiKey" 
                    name="apiKey" 
                    value={formData.apiKey}
                    onChange={handleInputChange}
                    placeholder="輸入您的 API Key"
                  />
                  <button 
                    type="button" 
                    className="toggle-visibility-button"
                    onClick={toggleShowApiKey}
                  >
                    {showApiKey ? '隱藏' : '顯示'}
                  </button>
                </div>
                <div className="form-hint">
                  請輸入您的 OpenAI API Key。如果您沒有，請前往 <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">OpenAI</a> 獲取。
                </div>
              </div>
            </div>
            
            <div className="settings-section">
              <h2>模型設置</h2>
              
              <div className="form-group">
                <label htmlFor="model">模型</label>
                <select 
                  id="model" 
                  name="model" 
                  value={formData.model}
                  onChange={handleInputChange}
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="temperature">溫度 ({formData.temperature})</label>
                <input 
                  type="range" 
                  id="temperature" 
                  name="temperature" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={formData.temperature}
                  onChange={handleNumberChange}
                />
                <div className="range-labels">
                  <span>更確定性</span>
                  <span>更創造性</span>
                </div>
                <div className="form-hint">
                  較低的值使輸出更確定，較高的值使輸出更多樣化和創造性。
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="maxTokens">最大 Token 數</label>
                <input 
                  type="number" 
                  id="maxTokens" 
                  name="maxTokens" 
                  min="100" 
                  max="4000" 
                  value={formData.maxTokens}
                  onChange={handleNumberChange}
                />
                <div className="form-hint">
                  限制生成文本的最大長度。較高的值允許更長的回應，但可能增加成本。
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="save-button"
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? '儲存中...' : '儲存設置'}
              </button>
              
              {saveStatus === 'success' && (
                <div className="success-message">設置已成功保存！</div>
              )}
              
              {saveStatus === 'error' && (
                <div className="error-message">保存設置失敗，請重試。</div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
