import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-container">
        <Sidebar />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
