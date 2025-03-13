import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUpload, FaTrash, FaSearch } from 'react-icons/fa';
import './KnowledgeBasePage.css';

const KnowledgeBasePage = () => {
  const [activeSection, setActiveSection] = useState('build');
  const [knowledgeFiles, setKnowledgeFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchKnowledgeFiles();
  }, []);

  const fetchKnowledgeFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/knowledge-files');
      if (response.data.success) {
        setKnowledgeFiles(response.data.files);
      } else {
        setError(response.data.message || '獲取知識庫文件失敗');
      }
    } catch (err) {
      setError('獲取知識庫文件時發生錯誤');
      console.error('Error fetching knowledge files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('/api/upload-knowledge-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        fetchKnowledgeFiles();
      } else {
        setError(response.data.message || '上傳文件失敗');
      }
    } catch (err) {
      setError('上傳文件時發生錯誤');
      console.error('Error uploading file:', err);
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    try {
      setLoading(true);
      const response = await axios.delete(`/api/knowledge-file/${fileToDelete.id}`);
      if (response.data.success) {
        fetchKnowledgeFiles();
      } else {
        setError(response.data.message || '刪除文件失敗');
      }
    } catch (err) {
      setError('刪除文件時發生錯誤');
      console.error('Error deleting file:', err);
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setFileToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setFileToDelete(null);
  };

  return (
    <div className="knowledge-base-page">
      <div className="function-selector">
        <div 
          className={`function-item ${activeSection === 'build' ? 'active' : ''}`}
          onClick={() => handleSectionChange('build')}
        >
          <div className="function-icon"><FaUpload /></div>
          <div className="function-name">建立機器人知識庫</div>
        </div>
        <div 
          className={`function-item ${activeSection === 'query' ? 'active' : ''}`}
          onClick={() => handleSectionChange('query')}
        >
          <div className="function-icon"><FaSearch /></div>
          <div className="function-name">查詢機器人知識庫</div>
        </div>
      </div>

      <div className="knowledge-main">
        <div className="knowledge-title">
          <h1>機器人知識庫</h1>
        </div>
        
        {activeSection === 'build' && (
          <div className="knowledge-build-section">
            <div className="upload-section">
              <h2>上傳知識庫文件</h2>
              <p>上傳 PDF、DOCX、TXT 或 CSV 文件作為機器人知識庫的來源。</p>
              <button 
                className="upload-button"
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
              >
                <FaUpload /> 選擇文件
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,.txt,.csv"
                style={{ display: 'none' }}
              />
            </div>
            
            <div className="files-section">
              <h2>已上傳的文件</h2>
              {loading ? (
                <div className="loading">載入中...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : knowledgeFiles.length === 0 ? (
                <div className="no-files">暫無上傳的文件</div>
              ) : (
                <ul className="files-list">
                  {knowledgeFiles.map((file) => (
                    <li key={file.id} className="file-item">
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-meta">
                          <span>{file.size}</span>
                          <span>{file.date}</span>
                        </div>
                      </div>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteClick(file)}
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        
        {activeSection === 'query' && (
          <div className="knowledge-query-section">
            <h2>查詢知識庫</h2>
            <p>輸入問題，從您的知識庫中獲取答案。</p>
            <div className="query-form">
              <textarea 
                placeholder="輸入您的問題..."
                className="query-input"
              />
              <button className="query-button">查詢</button>
            </div>
            <div className="query-result">
              <h3>查詢結果</h3>
              <div className="result-content">
                尚未進行查詢，請輸入問題並點擊查詢按鈕。
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3>確認刪除</h3>
              <button className="close-dialog" onClick={cancelDelete}>×</button>
            </div>
            <div className="dialog-body">
              <p>確定要刪除文件 "{fileToDelete?.name}" 嗎？此操作無法撤銷。</p>
            </div>
            <div className="dialog-footer">
              <button className="cancel-btn" onClick={cancelDelete}>取消</button>
              <button className="delete-btn" onClick={confirmDelete}>刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBasePage;
