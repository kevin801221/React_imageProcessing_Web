import React, { useEffect, useRef, useCallback, useMemo } from 'react';
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
    if (radius <= 0) return;
    
    const r = Math.min(width, height) * (radius / 100);
    
    // Create a temporary canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Copy current canvas to temp canvas
    tempCtx.drawImage(ctx.canvas, 0, 0);
    
    // Clear the original canvas
    ctx.clearRect(0, 0, width, height);
    
    // Create rounded rectangle path
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
    
    // Clip to the rounded rectangle
    ctx.clip();
    
    // Draw the image back
    ctx.drawImage(tempCanvas, 0, 0);
  }, []);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    const img = imageRef.current;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Create a temporary canvas for better performance
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
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

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Apply corner radius if needed
    if (cornerRadius > 0) {
      applyCornerRadius(ctx, cornerRadius, canvas.width, canvas.height);
    }

    // Reset filter
    ctx.filter = 'none';
  }, [filterParams, selectedFilter, transparency]);

  useEffect(() => {
    if (!image) return;

    // Track if component is mounted
    let isMounted = true;
    
    // Load the image
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = image;
    imageRef.current = img;

    img.onload = () => {
      if (isMounted) {
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
    if (imageRef.current) {
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
