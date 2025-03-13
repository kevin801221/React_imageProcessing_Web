import { useState, useRef } from 'react';

/**
 * Custom hook for handling file uploads
 * 
 * @param {Object} options - Configuration options
 * @param {Function} options.onFileSelected - Callback when file is selected
 * @param {string} options.acceptedTypes - Accepted file types (e.g., 'image/*')
 * @param {boolean} options.multiple - Allow multiple file selection
 * @returns {Object} - File upload handlers and state
 */
const useFileUpload = ({ 
  onFileSelected, 
  acceptedTypes = '*', 
  multiple = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (multiple) {
      onFileSelected(Array.from(files));
    } else {
      onFileSelected(files[0]);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    if (multiple) {
      onFileSelected(Array.from(files));
    } else {
      onFileSelected(files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    fileInputRef,
    isDragging,
    handleFileChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleUploadClick,
    inputProps: {
      type: 'file',
      ref: fileInputRef,
      onChange: handleFileChange,
      accept: acceptedTypes,
      multiple,
      style: { display: 'none' }
    },
    dropzoneProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onClick: handleUploadClick
    }
  };
};

export default useFileUpload;
