import React, { useState, useRef, useEffect } from 'react';
import './BackgroundRemover.css';

const BackgroundRemover = ({ 
  originalImage, 
  onProcessedImage,
  isProcessing,
  setIsProcessing
}) => {
  const [maskCanvas, setMaskCanvas] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, done, error
  const canvasRef = useRef(null);
  const resultCanvasRef = useRef(null);

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
    };
  }, [originalImage]);

  // Function to remove background
  const removeBackground = async () => {
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
  };

  // Simulate background removal with a delay
  const simulateBackgroundRemoval = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a simple mask (this would be replaced by actual ML segmentation)
        const canvas = canvasRef.current;
        const resultCanvas = resultCanvasRef.current;
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
      }, 2000); // Simulate processing time
    });
  };

  return (
    <div className="background-remover">
      <div className="remover-controls">
        <button 
          className="remove-bg-button" 
          onClick={removeBackground}
          disabled={!originalImage || status === 'processing'}
        >
          {status === 'processing' ? '處理中...' : '移除背景'}
        </button>
        
        {status === 'error' && (
          <div className="error-message">背景移除失敗，請重試</div>
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
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;
