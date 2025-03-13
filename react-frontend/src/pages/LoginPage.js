import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('請填寫所有必填欄位');
      return;
    }
    
    try {
      setError(null);
      const result = await login(formData);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || '登入失敗，請檢查您的帳號和密碼');
      }
    } catch (err) {
      setError('登入過程中發生錯誤');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>登入</h1>
          <p>歡迎回來！請登入您的帳號</p>
        </div>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">電子郵件</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleInputChange}
              placeholder="輸入您的電子郵件"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密碼</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleInputChange}
              placeholder="輸入您的密碼"
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? '登入中...' : '登入'}
            </button>
          </div>
        </form>
        
        <div className="login-footer">
          <p>還沒有帳號？<Link to="/register">立即註冊</Link></p>
          <p><Link to="/forgot-password">忘記密碼？</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
