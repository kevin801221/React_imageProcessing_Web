import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaImage, FaRedo, FaSave, FaDownload, FaUndo, FaCrop, FaAdjust, FaCut } from 'react-icons/fa';
import { MdOutlineColorLens, MdSettings } from 'react-icons/md';
import ImageCanvas from '../components/ImageEditor/ImageCanvas';
import FilterControl from '../components/ImageEditor/FilterControl';
import FilterGallery from '../components/ImageEditor/FilterGallery';
import BackgroundRemover from '../components/ImageEditor/BackgroundRemover';
import './ImageEditorPage.css';

const ImageEditorPage = () => {
  const [image, setImage] = useState(null);
  // We'll keep the loading state for future use
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('比例');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [filterParams, setFilterParams] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    opacity: 0,
    sharpness: 0,
    whiteBalance: 0,
    cornerRadius: 25,
    transparency: 25,
  });
  const [selectedFilter, setSelectedFilter] = useState('無');
  const [selectedLayout, setSelectedLayout] = useState('北歐');
  const [zoomLevel, setZoomLevel] = useState(25);
  
  // No longer need canvasRef as we're using ImageCanvas component
  const fileInputRef = useRef(null);

  const applyFilters = useCallback(() => {
    // In a real implementation, this would apply filters to the canvas
    // For now, we'll just log the filter values
    console.log('Applying filters:', filterParams);
    console.log('Selected filter:', selectedFilter);
    console.log('Selected layout:', selectedLayout);
  }, [filterParams, selectedFilter, selectedLayout]);

  useEffect(() => {
    if (image) {
      applyFilters();
    }
  }, [image, applyFilters]);

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setError('請選擇有效的圖片文件');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target.result);
          setError(null);
        };
        reader.readAsDataURL(file);
      } else {
        setError('請選擇有效的圖片文件');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFilterChange = (param, value) => {
    setFilterParams(prev => ({
      ...prev,
      [param]: value
    }));
  };



  const handleReset = () => {
    setFilterParams({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      opacity: 0,
      sharpness: 0,
      whiteBalance: 0,
      cornerRadius: 25,
      transparency: 25,
    });
    setSelectedFilter('無');
    setSelectedLayout('北歐');
    setZoomLevel(25);
  };

  const handleSave = () => {
    // In a real implementation, this would save the edited image
    alert('儲存功能將在實際應用中實現');
  };

  const handleDownload = () => {
    // In a real implementation, this would download the edited image
    if (!image) return;
    
    try {
      // Use the processed image if available, otherwise use the original image
      const imageToDownload = processedImage || image;
      
      const a = document.createElement('a');
      a.href = imageToDownload;
      a.download = 'edited-image.png';
      a.click();
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('下載圖片時發生錯誤');
    }
  };
  
  const handleProcessedImage = (processedImageData) => {
    setProcessedImage(processedImageData);
    // Update the displayed image
    setImage(processedImageData);
  };

  const renderFilterControls = () => {
    switch (activeTab) {
      case '比例':
        return (
          <div className="filter-controls">
            <div className="filter-section">
              <FilterControl 
                label="亮度" 
                value={filterParams.brightness} 
                min="-100" 
                max="100" 
                onChange={(value) => handleFilterChange('brightness', value)} 
              />
              <FilterControl 
                label="對比度" 
                value={filterParams.contrast} 
                min="-100" 
                max="100" 
                onChange={(value) => handleFilterChange('contrast', value)} 
              />
              <FilterControl 
                label="飽和度" 
                value={filterParams.saturation} 
                min="-100" 
                max="100" 
                onChange={(value) => handleFilterChange('saturation', value)} 
              />
              <FilterControl 
                label="不透明度" 
                value={filterParams.opacity} 
                min="0" 
                max="100" 
                onChange={(value) => handleFilterChange('opacity', value)} 
              />
              <FilterControl 
                label="銳利度" 
                value={filterParams.sharpness} 
                min="-100" 
                max="100" 
                onChange={(value) => handleFilterChange('sharpness', value)} 
              />
              <FilterControl 
                label="白平衡" 
                value={filterParams.whiteBalance} 
                min="-100" 
                max="100" 
                onChange={(value) => handleFilterChange('whiteBalance', value)} 
              />
            </div>
            <button className="reset-button" onClick={handleReset}>重新調整</button>
          </div>
        );
      case '濾鏡':
        return (
          <FilterGallery 
            filters={[
              { id: '無', label: '原圖' },
              { id: '北歐', label: '北歐', previewClass: 'filter-nordic' },
              { id: '懷舊', label: '懷舊', previewClass: 'filter-vintage' }
            ]}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
          />
        );
      case '剪裁':
        return (
          <div className="crop-controls">
            <div className="crop-options">
              <button className="crop-option">1:1</button>
              <button className="crop-option">4:3</button>
              <button className="crop-option">16:9</button>
              <button className="crop-option">自由</button>
            </div>
            <div className="crop-actions">
              <button className="crop-action">套用</button>
              <button className="crop-action">取消</button>
            </div>
          </div>
        );
      case '調整':
        return (
          <div className="adjustment-controls">
            <div className="filter-section">
              <FilterControl 
                label="圓角化" 
                value={filterParams.cornerRadius} 
                min="0" 
                max="50" 
                onChange={(value) => handleFilterChange('cornerRadius', value)} 
              />
              <FilterControl 
                label="透明度" 
                value={filterParams.transparency} 
                min="0" 
                max="100" 
                onChange={(value) => handleFilterChange('transparency', value)} 
              />
            </div>
          </div>
        );
      case '背景移除':
        return (
          <BackgroundRemover 
            originalImage={image}
            onProcessedImage={handleProcessedImage}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="image-editor-page">
      <h1 className="page-title">圖片編輯</h1>
      
      <div className="image-editor-container">
        <div className="toolbar">
          <button className="tool-button" onClick={() => fileInputRef.current.click()}>
            <FaImage />
          </button>
          <button className="tool-button">
            <FaUndo />
          </button>
          <button className="tool-button">
            <FaRedo />
          </button>
          <button className="tool-button" onClick={handleSave}>
            <FaSave />
          </button>
          <button className="tool-button" onClick={handleDownload}>
            <FaDownload />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*" 
            onChange={handleFileSelected} 
          />
        </div>
        
        <div className="editor-main">
          <div className="editor-sidebar">
            <div className="sidebar-tabs">
              <button 
                className={`tab-button ${activeTab === '比例' ? 'active' : ''}`} 
                onClick={() => setActiveTab('比例')}
              >
                <MdSettings />
                <span>比例</span>
              </button>
              <button 
                className={`tab-button ${activeTab === '濾鏡' ? 'active' : ''}`} 
                onClick={() => setActiveTab('濾鏡')}
              >
                <MdOutlineColorLens />
                <span>濾鏡</span>
              </button>
              <button 
                className={`tab-button ${activeTab === '剪裁' ? 'active' : ''}`} 
                onClick={() => setActiveTab('剪裁')}
              >
                <FaCrop />
                <span>剪裁</span>
              </button>
              <button 
                className={`tab-button ${activeTab === '調整' ? 'active' : ''}`} 
                onClick={() => setActiveTab('調整')}
              >
                <FaAdjust />
                <span>調整</span>
              </button>
              <button 
                className={`tab-button ${activeTab === '背景移除' ? 'active' : ''}`} 
                onClick={() => setActiveTab('背景移除')}
              >
                <FaCut />
                <span>背景移除</span>
              </button>
            </div>
            
            <div className="sidebar-content">
              {renderFilterControls()}
            </div>
          </div>
          
          <div className="editor-canvas-container">
            {!image ? (
              <div 
                className="upload-area" 
                onDrop={handleDrop} 
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="upload-icon">
                  <FaImage />
                </div>
                <div className="upload-text">拖放圖片到此處或點擊上傳</div>
              </div>
            ) : (
              <div className="canvas-wrapper">
                <div className="canvas-controls">
                  <div className="zoom-control">
                    <label>縮放: {zoomLevel}%</label>
                    <input 
                      type="range" 
                      min="10" 
                      max="200" 
                      value={zoomLevel} 
                      onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="canvas-container" style={{ transform: `scale(${zoomLevel / 100})` }}>
                  {image ? (
                    <ImageCanvas 
                      image={image}
                      filterParams={filterParams}
                      selectedFilter={selectedFilter}
                      selectedLayout={selectedLayout}
                      cornerRadius={filterParams.cornerRadius}
                      transparency={filterParams.transparency}
                    />
                  ) : (
                    <div className="empty-canvas"></div>
                  )}
                  {loading && (
                    <div className="canvas-loading">
                      <div className="spinner"></div>
                      <div>處理中...</div>
                    </div>
                  )}
                  {error && (
                    <div className="canvas-error">
                      <div>{error}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="editor-sidebar right-sidebar">
            <div className="filter-gallery-container">
              <h3>濾鏡</h3>
              <FilterGallery 
                filters={[
                  { id: '無', label: '原圖' },
                  { id: '北歐', label: '北歐', previewClass: 'filter-nordic' },
                  { id: '懷舊', label: '懷舊', previewClass: 'filter-vintage' }
                ]}
                selectedFilter={selectedFilter}
                onSelectFilter={setSelectedFilter}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorPage;
