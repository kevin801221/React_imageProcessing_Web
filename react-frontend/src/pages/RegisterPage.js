import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const { register, loading } = useAuth();
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
    
    // Validate form
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('請填寫所有必填欄位');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('兩次輸入的密碼不一致');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('密碼長度必須至少為6個字符');
      return;
    }
    
    try {
      setError(null);
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || '註冊失敗，請稍後再試');
      }
    } catch (err) {
      setError('註冊過程中發生錯誤');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>註冊帳號</h1>
          <p>創建一個新帳號以使用我們的服務</p>
        </div>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">用戶名</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleInputChange}
              placeholder="輸入您的用戶名"
              required
            />
          </div>
          
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
            <div className="form-hint">密碼長度必須至少為6個字符</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">確認密碼</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="再次輸入您的密碼"
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="register-button"
              disabled={loading}
            >
              {loading ? '註冊中...' : '註冊'}
            </button>
          </div>
        </form>
        
        <div className="register-footer">
          <p>已有帳號？<Link to="/login">立即登入</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
