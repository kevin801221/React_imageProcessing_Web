import React, { useState, useEffect } from 'react';
import { FaCopy, FaRedo, FaSave, FaSpinner, FaInfoCircle } from 'react-icons/fa';
import { productCopyApi } from '../services/api';
import './ProductCopyPage.css';

const ProductCopyPage = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    targetAudience: '',
    keyFeatures: '',
    tone: 'professional',
    length: 'medium',
    pricePoint: '',
    uniqueSellingPoints: '',
    competitiveAdvantage: ''
  });
  
  const [generatedCopy, setGeneratedCopy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState('unknown'); // 'unknown', 'available', 'unavailable'

  // 加載保存的模板
  useEffect(() => {
    try {
      const templates = JSON.parse(localStorage.getItem('copyTemplates') || '[]');
      setSavedTemplates(templates);
    } catch (err) {
      console.error('Error loading templates:', err);
    }

    // 檢查 Ollama 服務是否可用
    checkOllamaStatus();
  }, []);

  // 檢查 Ollama 服務狀態
  const checkOllamaStatus = async () => {
    try {
      const settings = JSON.parse(localStorage.getItem('appSettings') || '{"ollama_url":"http://localhost:11434/api/generate"}');
      
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
      
      console.log('ProductCopyPage - Checking Ollama status at:', ollamaBaseUrl);
      
      // 使用 Ollama 的根端點檢查服務是否可用
      const response = await fetch(ollamaBaseUrl);
      const text = await response.text();
      
      // 如果回應包含 "Ollama is running"，則服務可用
      if (text.includes('Ollama is running')) {
        setOllamaStatus('available');
      } else {
        setOllamaStatus('unavailable');
      }
    } catch (err) {
      console.error('Error checking Ollama status:', err);
      setOllamaStatus('unavailable');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateSelect = (e) => {
    const templateId = e.target.value;
    if (templateId === '') {
      setSelectedTemplate(null);
      return;
    }

    const template = savedTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setGeneratedCopy(template.content);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.productName || !formData.productType) {
      setError('請填寫產品名稱和類型');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await productCopyApi.generateCopy(formData);
      
      if (response.data.success) {
        setGeneratedCopy(response.data.copy);
      } else {
        setError(response.data.message || '生成文案失敗');
      }
    } catch (err) {
      setError('生成文案過程中發生錯誤');
      console.error('Error generating copy:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await productCopyApi.generateCopy(formData);
      
      if (response.data.success) {
        setGeneratedCopy(response.data.copy);
      } else {
        setError(response.data.message || '重新生成文案失敗');
      }
    } catch (err) {
      setError('重新生成文案過程中發生錯誤');
      console.error('Error regenerating copy:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedCopy) return;
    
    navigator.clipboard.writeText(generatedCopy)
      .then(() => {
        alert('已複製到剪貼簿');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('複製失敗');
      });
  };

  const handleOpenSaveDialog = () => {
    if (!generatedCopy) return;
    setShowSaveDialog(true);
  };

  const handleCloseSaveDialog = () => {
    setShowSaveDialog(false);
    setTemplateName('');
  };

  const handleSaveTemplate = async () => {
    if (!generatedCopy || !templateName) return;
    
    try {
      // 保存到 localStorage
      const templates = JSON.parse(localStorage.getItem('copyTemplates') || '[]');
      
      const newTemplate = {
        id: Date.now().toString(),
        name: templateName,
        content: generatedCopy,
        date: new Date().toISOString(),
        productInfo: { ...formData }
      };
      
      templates.push(newTemplate);
      localStorage.setItem('copyTemplates', JSON.stringify(templates));
      
      // 更新狀態
      setSavedTemplates(templates);
      setSelectedTemplate(newTemplate);
      
      alert('模板已保存');
      handleCloseSaveDialog();
    } catch (err) {
      console.error('Error saving template:', err);
      alert('保存模板失敗');
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (!templateId || !window.confirm('確定要刪除此模板嗎？')) return;
    
    try {
      const templates = savedTemplates.filter(t => t.id !== templateId);
      localStorage.setItem('copyTemplates', JSON.stringify(templates));
      setSavedTemplates(templates);
      
      if (selectedTemplate && selectedTemplate.id === templateId) {
        setSelectedTemplate(null);
        setGeneratedCopy(null);
      }
      
      alert('模板已刪除');
    } catch (err) {
      console.error('Error deleting template:', err);
      alert('刪除模板失敗');
    }
  };

  return (
    <div className="product-copy-page">
      <h1 className="page-title">商品文案生成</h1>
      
      {ollamaStatus === 'unavailable' && (
        <div className="ollama-status-warning">
          <FaInfoCircle /> Ollama 服務目前不可用。文案生成可能會使用備用方案或失敗。
        </div>
      )}
      
      <div className="product-copy-container">
        <div className="form-container">
          <h2>產品資訊</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productName">產品名稱 *</label>
              <input 
                type="text" 
                id="productName" 
                name="productName" 
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="例如：超輕量運動鞋"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="productType">產品類型 *</label>
              <input 
                type="text" 
                id="productType" 
                name="productType" 
                value={formData.productType}
                onChange={handleInputChange}
                placeholder="例如：運動鞋、電子產品、家居用品"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="targetAudience">目標受眾</label>
              <input 
                type="text" 
                id="targetAudience" 
                name="targetAudience" 
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="例如：年輕運動愛好者、上班族、家庭主婦"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="pricePoint">價格定位</label>
              <input 
                type="text" 
                id="pricePoint" 
                name="pricePoint" 
                value={formData.pricePoint}
                onChange={handleInputChange}
                placeholder="例如：中高端、平價、奢侈品"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="keyFeatures">產品特點</label>
              <textarea 
                id="keyFeatures" 
                name="keyFeatures" 
                value={formData.keyFeatures}
                onChange={handleInputChange}
                placeholder="列出產品的主要特點和優勢，每行一個"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="uniqueSellingPoints">獨特賣點</label>
              <textarea 
                id="uniqueSellingPoints" 
                name="uniqueSellingPoints" 
                value={formData.uniqueSellingPoints}
                onChange={handleInputChange}
                placeholder="產品與競品相比的獨特優勢"
                rows="2"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="competitiveAdvantage">競爭優勢</label>
              <textarea 
                id="competitiveAdvantage" 
                name="competitiveAdvantage" 
                value={formData.competitiveAdvantage}
                onChange={handleInputChange}
                placeholder="相較於市場上同類產品的優勢"
                rows="2"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tone">文案風格</label>
              <select 
                id="tone" 
                name="tone" 
                value={formData.tone}
                onChange={handleInputChange}
              >
                <option value="professional">專業正式</option>
                <option value="casual">輕鬆隨意</option>
                <option value="enthusiastic">熱情洋溢</option>
                <option value="humorous">幽默風趣</option>
                <option value="luxury">高端奢華</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="length">文案長度</label>
              <select 
                id="length" 
                name="length" 
                value={formData.length}
                onChange={handleInputChange}
              >
                <option value="short">簡短</option>
                <option value="medium">中等</option>
                <option value="long">詳盡</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="primary-button"
                disabled={loading}
              >
                {loading ? <><FaSpinner className="spinner" /> 生成中...</> : '生成文案'}
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
          </form>
          
          <div className="saved-templates">
            <h3>已保存的模板</h3>
            <select 
              value={selectedTemplate ? selectedTemplate.id : ''} 
              onChange={handleTemplateSelect}
              className="template-select"
            >
              <option value="">-- 選擇模板 --</option>
              {savedTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} ({new Date(template.date).toLocaleDateString()})
                </option>
              ))}
            </select>
            
            {selectedTemplate && (
              <button 
                className="delete-template-button"
                onClick={() => handleDeleteTemplate(selectedTemplate.id)}
              >
                刪除模板
              </button>
            )}
          </div>
        </div>
        
        <div className="result-container">
          <h2>生成的文案</h2>
          
          {generatedCopy ? (
            <>
              <div className="copy-content">
                <pre>{generatedCopy}</pre>
              </div>
              
              <div className="copy-actions">
                <button 
                  className="action-button"
                  onClick={handleCopyToClipboard}
                >
                  <FaCopy /> 複製文案
                </button>
                
                <button 
                  className="action-button"
                  onClick={handleRegenerate}
                  disabled={loading}
                >
                  <FaRedo /> {loading ? '生成中...' : '重新生成'}
                </button>
                
                <button 
                  className="action-button"
                  onClick={handleOpenSaveDialog}
                >
                  <FaSave /> 保存模板
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>填寫產品資訊並點擊「生成文案」按鈕來獲取專業的商品文案。</p>
            </div>
          )}
        </div>
      </div>
      
      {showSaveDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>保存文案模板</h3>
            
            <div className="form-group">
              <label htmlFor="templateName">模板名稱</label>
              <input 
                type="text" 
                id="templateName" 
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="輸入一個描述性的名稱"
              />
            </div>
            
            <div className="modal-actions">
              <button 
                className="primary-button"
                onClick={handleSaveTemplate}
                disabled={!templateName}
              >
                保存
              </button>
              
              <button 
                className="secondary-button"
                onClick={handleCloseSaveDialog}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCopyPage;
