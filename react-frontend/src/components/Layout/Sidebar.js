import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaImage, FaUser, FaClipboard, FaRobot, FaCog, FaInfoCircle, FaFileAlt, FaEye } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <div><FaImage /></div>
        <div className="sidebar-item-text">商品圖</div>
      </NavLink>
      
      <NavLink to="/product-copy" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <div><FaFileAlt /></div>
        <div className="sidebar-item-text">商品文案</div>
      </NavLink>
      
      <NavLink to="/image-understanding" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <div><FaEye /></div>
        <div className="sidebar-item-text">圖像理解</div>
      </NavLink>
      
      <NavLink to="/knowledge-base" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <div><FaRobot /></div>
        <div className="sidebar-item-text">知識庫</div>
      </NavLink>
      
      <NavLink to="/user" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <div><FaUser /></div>
        <div className="sidebar-item-text">我的</div>
      </NavLink>
      
      <NavLink to="/records" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <div><FaClipboard /></div>
        <div className="sidebar-item-text">生成紀錄</div>
      </NavLink>
      
      <NavLink to="/settings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <div><FaCog /></div>
        <div className="sidebar-item-text">設置</div>
      </NavLink>
      
      <div className="sidebar-item" style={{ marginTop: 'auto' }}>
        <div><FaInfoCircle /></div>
        <div className="sidebar-item-text">免責聲明</div>
      </div>
    </div>
  );
};

export default Sidebar;
