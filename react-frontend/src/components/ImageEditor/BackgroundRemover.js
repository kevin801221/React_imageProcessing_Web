import React, { useState, useRef, useEffect, useCallback } from 'react';
import './BackgroundRemover.css';

// Using React.memo to prevent unnecessary re-renders
const BackgroundRemover = React.memo(({ 
  originalImage, 
  onProcessedImage,
  isProcessing,
  setIsProcessing
}) => {
  // We'll use this state to track the mask for potential future enhancements
  const [, setMaskCanvas] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, done, error
  const canvasRef = useRef(null);
  const resultCanvasRef = useRef(null);

  // Initialize canvas when the component mounts
  useEffect(() => {
    if (!originalImage) return;
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = originalImage;
    
    // Initialize result canvas as well
    const resultCanvas = resultCanvasRef.current;
    if (resultCanvas) {
      const resultCtx = resultCanvas.getContext('2d');
      resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    }
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Also initialize the result canvas with the same dimensions
      if (resultCanvas) {
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
      }
    };
    
    // Cleanup function
    return () => {
      // Cancel any pending operations when component unmounts or image changes
      img.onload = null;
    };
  }, [originalImage]);

  // Function to remove background
  const removeBackground = useCallback(async () => {
    if (!originalImage || status === 'processing') return;
    
    setStatus('processing');
    setIsProcessing(true);
    
    try {
      // In a real implementation, you would use a machine learning model or API
      // to segment the image and create a mask. For now, we'll simulate it.
      await simulateBackgroundRemoval();
      
      setStatus('done');
      setIsProcessing(false);
      
      // If we have a result, pass it back to the parent component
      if (resultCanvasRef.current) {
        const dataURL = resultCanvasRef.current.toDataURL('image/png');
        onProcessedImage(dataURL);
      }
    } catch (error) {
      console.error('Error removing background:', error);
      setStatus('error');
      setIsProcessing(false);
    }
  }, [originalImage, status, setIsProcessing, onProcessedImage, simulateBackgroundRemoval]);

  // Simulate background removal with a delay
  const simulateBackgroundRemoval = useCallback(() => {
    return new Promise((resolve) => {
      // Create a worker to process the image in a separate thread
      const processImage = () => {
        // Create a simple mask (this would be replaced by actual ML segmentation)
        const canvas = canvasRef.current;
        const resultCanvas = resultCanvasRef.current;
        if (!canvas || !resultCanvas) {
          resolve();
          return;
        }
        
        const ctx = canvas.getContext('2d');
        const resultCtx = resultCanvas.getContext('2d');
        
        // Set result canvas dimensions
        resultCanvas.width = canvas.width;
        resultCanvas.height = canvas.height;
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Create a simple mask (in a real implementation, this would be from ML model)
        // For demonstration, we'll just make a simple threshold based on color
        for (let i = 0; i < data.length; i += 4) {
          // Simple threshold - in real implementation this would be ML-based
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Simple heuristic: if pixel is close to blue (for the blue containers)
          // or has high brightness, keep it; otherwise make transparent
          const isProduct = (b > r + 50 && b > g + 50) || (r + g + b > 600);
          
          if (!isProduct) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }
        
        // Draw the processed image with transparent background
        resultCtx.putImageData(imageData, 0, 0);
        
        // Store the mask canvas for future reference
        setMaskCanvas(resultCanvas);
        
        resolve();
      };
      
      // Simulate processing delay
      setTimeout(processImage, 2000);
    });
  }, [canvasRef, resultCanvasRef, setMaskCanvas]);

  return (
    <div className="background-remover">
      <div className="remover-controls">
        <button 
          className="remove-bg-button" 
          onClick={removeBackground}
          disabled={!originalImage || status === 'processing'}
        >
          {status === 'processing' ? (
            <>
              <div className="spinner-small"></div>
              <span style={{ marginLeft: '8px' }}>處理中...</span>
            </>
          ) : (
            '移除背景'
          )}
        </button>
        
        {status === 'error' && (
          <div className="error-message">背景移除失敗，請重試</div>
        )}
        
        {status === 'done' && (
          <div className="success-message">背景移除成功!</div>
        )}
      </div>
      
      <div className="canvas-container">
        <div className="original-image">
          <h4>原圖</h4>
          <canvas ref={canvasRef} className="bg-canvas"></canvas>
        </div>
        
        <div className="result-image">
          <h4>結果</h4>
          <canvas ref={resultCanvasRef} className="bg-canvas"></canvas>
          {status === 'processing' && (
            <div className="canvas-processing-overlay">
              <div className="spinner"></div>
              <p>正在處理圖片...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default BackgroundRemover;
