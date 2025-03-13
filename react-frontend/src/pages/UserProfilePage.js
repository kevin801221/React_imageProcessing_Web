import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaCoins, FaHistory, FaUser, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { user, points, checkPointsHistory } = useAuth();
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (activeTab === 'history') {
      fetchPointsHistory();
    }
  }, [activeTab]);

  const fetchPointsHistory = async () => {
    try {
      setLoading(true);
      const result = await checkPointsHistory();
      if (result.success) {
        setPointsHistory(result.history);
      } else {
        setError(result.message || '無法獲取點數歷史記錄');
      }
    } catch (err) {
      setError('獲取點數歷史記錄時發生錯誤');
      console.error('Error fetching points history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="loading-container">
          <div>請先登入以查看您的個人資料</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <h1 className="page-title">我的帳戶</h1>
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <div className="avatar-placeholder">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h2>{user.username}</h2>
            <div className="points-display">
              <FaCoins className="coins-icon" />
              <span>{points} 點數</span>
            </div>
          </div>
        </div>
        
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            個人資料
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            點數歷史
          </button>
        </div>
        
        <div className="profile-content">
          {activeTab === 'profile' ? (
            <div className="profile-details">
              <div className="detail-item">
                <div className="detail-icon"><FaUser /></div>
                <div className="detail-content">
                  <div className="detail-label">用戶名</div>
                  <div className="detail-value">{user.username}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon"><FaEnvelope /></div>
                <div className="detail-content">
                  <div className="detail-label">電子郵件</div>
                  <div className="detail-value">{user.email}</div>
                </div>
              </div>
              
              {user.createdAt && (
                <div className="detail-item">
                  <div className="detail-icon"><FaCalendarAlt /></div>
                  <div className="detail-content">
                    <div className="detail-label">註冊日期</div>
                    <div className="detail-value">{formatDate(user.createdAt)}</div>
                  </div>
                </div>
              )}
              
              <div className="detail-item">
                <div className="detail-icon"><FaCoins /></div>
                <div className="detail-content">
                  <div className="detail-label">點數餘額</div>
                  <div className="detail-value">{points} 點數</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="points-history">
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <div>載入中...</div>
                </div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : pointsHistory.length === 0 ? (
                <div className="empty-history">
                  <FaHistory className="history-icon" />
                  <div>暫無點數使用記錄</div>
                </div>
              ) : (
                <div className="history-list">
                  {pointsHistory.map((item, index) => (
                    <div key={index} className="history-item">
                      <div className="history-date">{formatDate(item.date)}</div>
                      <div className="history-description">{item.description}</div>
                      <div className={`history-amount ${item.amount > 0 ? 'positive' : 'negative'}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount} 點數
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
