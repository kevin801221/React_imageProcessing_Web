import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './ImagePreview.css';

const ImagePreview = ({ image, onClear, isLoading }) => {
  return (
    <div className="image-preview-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">處理中...</div>
        </div>
      )}
      <img src={image} alt="Preview" className="preview-image" />
      <button className="clear-button" onClick={onClear} disabled={isLoading}>
        <FaTimes />
      </button>
    </div>
  );
};

export default ImagePreview;
