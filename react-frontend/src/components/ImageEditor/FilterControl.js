import React from 'react';
import './FilterControl.css';

// Using React.memo to prevent unnecessary re-renders
const FilterControl = React.memo(({ 
  label, 
  value, 
  min, 
  max, 
  onChange 
}) => {
  return (
    <div className="filter-control">
      <label>{label}</label>
      <div className="slider-container">
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
        />
        <span className="slider-value">{value}</span>
      </div>
    </div>
  );
});

export default FilterControl;
