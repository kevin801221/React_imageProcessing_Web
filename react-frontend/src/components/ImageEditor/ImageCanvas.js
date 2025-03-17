import React, { useEffect, useRef, useCallback } from 'react';
import './ImageCanvas.css';

// Using React.memo to prevent unnecessary re-renders
const ImageCanvas = React.memo(({ 
  image, 
  filterParams, 
  selectedFilter, 
  selectedLayout,
  cornerRadius,
  transparency
}) => {
  // Function to apply corner radius to the canvas
  const applyCornerRadius = useCallback((ctx, radius, width, height) => {
    if (radius <= 0 || width <= 0 || height <= 0) return;
    
    const r = Math.min(width, height) * (radius / 100);
    
    // 直接使用裁剪路徑而不是臨時畫布
    // 保存當前狀態
    ctx.save();
    
    // 創建圓角矩形路徑
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(width - r, 0);
    ctx.quadraticCurveTo(width, 0, width, r);
    ctx.lineTo(width, height - r);
    ctx.quadraticCurveTo(width, height, width - r, height);
    ctx.lineTo(r, height);
    ctx.quadraticCurveTo(0, height, 0, height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    
    // 裁剪到圓角矩形
    ctx.clip();
  }, []);
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    const img = imageRef.current;

    // 確保圖像已經加載並且有有效的尺寸
    if (img.width <= 0 || img.height <= 0) return;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filters
    ctx.filter = `
      brightness(${100 + filterParams.brightness}%) 
      contrast(${100 + filterParams.contrast}%) 
      saturate(${100 + filterParams.saturation}%)
      opacity(${100 - transparency}%)
    `;

    // Apply selected filter
    if (selectedFilter === '北歐') {
      ctx.filter += ' sepia(30%) hue-rotate(180deg)';
    } else if (selectedFilter === '懷舊') {
      ctx.filter += ' sepia(70%)';
    }

    // Apply corner radius if needed
    if (cornerRadius > 0) {
      applyCornerRadius(ctx, cornerRadius, canvas.width, canvas.height);
    }

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // 如果應用了圓角，恢復上下文狀態
    if (cornerRadius > 0) {
      ctx.restore();
    }

    // Reset filter
    ctx.filter = 'none';
  }, [filterParams, selectedFilter, transparency, cornerRadius, applyCornerRadius]);

  useEffect(() => {
    if (!image) return;

    // Track if component is mounted
    let isMounted = true;
    
    // Load the image
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = image;
    
    img.onload = () => {
      if (isMounted) {
        imageRef.current = img;
        // Use requestAnimationFrame for smoother rendering
        requestAnimationFrame(() => {
          if (isMounted) {
            renderCanvas();
          }
        });
      }
    };
    
    // Cleanup function
    return () => {
      isMounted = false;
      img.onload = null;
    };
  }, [image, renderCanvas]);

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete && imageRef.current.width > 0) {
      renderCanvas();
    }
  }, [filterParams, selectedFilter, selectedLayout, cornerRadius, transparency, renderCanvas]);

  return (
    <canvas 
      ref={canvasRef} 
      className="image-canvas"
      style={{ 
        borderRadius: `${cornerRadius}px`,
      }}
    />
  );
});

// Using React.memo to prevent unnecessary re-renders
export default ImageCanvas;
