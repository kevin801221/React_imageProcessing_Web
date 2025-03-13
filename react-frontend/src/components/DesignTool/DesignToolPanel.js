import React, { useState } from 'react';
import './DesignToolPanel.css';

const DesignToolPanel = ({ onGenerate, disabled, isLoading }) => {
  const [designParams, setDesignParams] = useState({
    style: 'modern',
    color: 'auto',
    text: '',
    layout: 'centered',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesignParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(designParams);
  };

  return (
    <div className="design-tool-panel">
      <h2 className="panel-title">設計參數</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="style">風格</label>
          <select 
            id="style" 
            name="style" 
            value={designParams.style}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="modern">現代</option>
            <option value="minimalist">極簡</option>
            <option value="vintage">復古</option>
            <option value="elegant">優雅</option>
            <option value="bold">大膽</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="color">主色調</label>
          <select 
            id="color" 
            name="color" 
            value={designParams.color}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="auto">自動選擇</option>
            <option value="red">紅色</option>
            <option value="blue">藍色</option>
            <option value="green">綠色</option>
            <option value="black">黑色</option>
            <option value="white">白色</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="text">文字內容</label>
          <textarea 
            id="text" 
            name="text" 
            value={designParams.text}
            onChange={handleChange}
            placeholder="輸入要顯示在圖片上的文字"
            disabled={disabled}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="layout">排版</label>
          <select 
            id="layout" 
            name="layout" 
            value={designParams.layout}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="centered">居中</option>
            <option value="top">頂部</option>
            <option value="bottom">底部</option>
            <option value="left">左側</option>
            <option value="right">右側</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="generate-button"
          disabled={disabled}
        >
          {isLoading ? '生成中...' : '生成設計'}
        </button>
      </form>
    </div>
  );
};

export default DesignToolPanel;
