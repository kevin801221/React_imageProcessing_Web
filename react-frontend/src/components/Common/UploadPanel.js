import React from 'react';
import { FaUpload } from 'react-icons/fa';
import './UploadPanel.css';

const UploadPanel = ({ 
  onUploadClick, 
  onDrop, 
  onDragOver, 
  fileInputRef, 
  handleFileChange,
  acceptedTypes,
  title = '上傳圖片',
  description = '拖放圖片到此處或點擊上傳'
}) => {
  return (
    <div 
      className="upload-panel" 
      onClick={onUploadClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="upload-icon">
        <FaUpload />
      </div>
      <div className="upload-title">{title}</div>
      <div className="upload-description">{description}</div>
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default UploadPanel;
