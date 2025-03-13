import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaSignOutAlt, FaCoins, FaCog } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { user, points, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 關閉下拉選單的點擊外部處理函數
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddPoints = () => {
    // 在實際應用中，這裡會打開支付模態框或重定向到支付頁面
    alert('正在重定向到支付頁面...');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('登出時發生錯誤:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="header">
      <div className="logo">AI 商品圖設計室</div>
      <div className="nav-buttons">
        <button className="nav-button">檔案</button>
        <button className="nav-button">↩</button>
        <button className="nav-button">↪</button>
      </div>
      
      <div className="user-section">
        {user ? (
          <>
            <div className="points-display">
              <FaCoins className="coins-icon" />
              <span>{points.toFixed(2)} 點數</span>
              <button className="add-points" onClick={handleAddPoints}>
                + 儲值
              </button>
            </div>
            
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="user-button" onClick={toggleDropdown}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="user-avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="username">{user.username}</span>
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/user" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FaUser className="dropdown-icon" />
                    <span>個人資料</span>
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FaCog className="dropdown-icon" />
                    <span>設定</span>
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>登出</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">登入</Link>
            <Link to="/register" className="register-btn">註冊</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
