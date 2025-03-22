import React, { useState, useRef, useEffect } from 'react';
import './BackgroundRemover.css';
import imageProcessingService from '../../services/imageProcessingService';

const BackgroundRemover = ({ 
  originalImage, 
  onProcessedImage,
  isProcessing,
  setIsProcessing
}) => {
  const [status, setStatus] = useState('idle'); // idle, processing, done, error
  const [errorMessage, setErrorMessage] = useState('');
  const canvasRef = useRef(null);
  const resultCanvasRef = useRef(null);
  const [originalImageFile, setOriginalImageFile] = useState(null);
  const [threshold, setThreshold] = useState(30); // 背景移除閾值參數

  // Initialize canvas when the component mounts
  useEffect(() => {
    if (!originalImage) return;
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = originalImage;
    
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Convert base64 to file object for API calls
      fetch(originalImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'image.png', { type: 'image/png' });
          setOriginalImageFile(file);
        })
        .catch(err => {
          console.error('Error converting image to file:', err);
        });
    };
  }, [originalImage]);

  // Function to remove background
  const removeBackground = async () => {
    if (!originalImageFile || status === 'processing') return;
    
    setStatus('processing');
    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      // 使用圖像處理服務移除背景，並傳遞閾值參數
      const result = await imageProcessingService.removeBackground(originalImageFile, {
        threshold: threshold
      });
      
      if (result.success) {
        setStatus('done');
        
        // 顯示處理後的圖像
        const processedImg = new Image();
        processedImg.crossOrigin = 'Anonymous';
        processedImg.src = result.processedImage;
        
        processedImg.onload = () => {
          const resultCanvas = resultCanvasRef.current;
          const resultCtx = resultCanvas.getContext('2d');
          
          // 設置畫布尺寸
          resultCanvas.width = processedImg.width;
          resultCanvas.height = processedImg.height;
          
          // 繪製處理後的圖像
          resultCtx.drawImage(processedImg, 0, 0);
          
          // 將處理後的圖像傳回父組件
          onProcessedImage(result.processedImage);
        };
      } else {
        setStatus('error');
        setErrorMessage(result.message || '背景移除失敗');
      }
    } catch (error) {
      console.error('Error removing background:', error);
      setStatus('error');
      setErrorMessage('處理圖像時發生錯誤');
    } finally {
      setIsProcessing(false);
    }
  };

  // 處理閾值變更
  const handleThresholdChange = (e) => {
    setThreshold(parseInt(e.target.value, 10));
  };

  return (
    <div className="background-remover">
      <div className="canvas-container">
        <canvas ref={canvasRef} className="original-canvas"></canvas>
        <canvas ref={resultCanvasRef} className="result-canvas"></canvas>
      </div>
      
      <div className="controls">
        <div className="parameter-controls">
          <div className="parameter-control">
            <label>閾值: {threshold}</label>
            <input 
              type="range" 
              min="5" 
              max="100" 
              value={threshold} 
              onChange={handleThresholdChange} 
            />
            <span className="parameter-value">{threshold}</span>
          </div>
        </div>
        
        <button 
          className="remove-bg-btn"
          onClick={removeBackground}
          disabled={!originalImage || status === 'processing'}
        >
          {status === 'processing' ? '處理中...' : '移除背景'}
        </button>
        
        {status === 'error' && (
          <div className="error-message">
            {errorMessage || '背景移除失敗，請重試'}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundRemover;
