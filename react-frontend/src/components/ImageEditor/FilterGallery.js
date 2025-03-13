import React from 'react';
import './FilterGallery.css';

const FilterGallery = ({ 
  filters, 
  selectedFilter, 
  onSelectFilter 
}) => {
  return (
    <div className="filter-gallery">
      {filters.map((filter) => (
        <div 
          key={filter.id} 
          className={`filter-option ${selectedFilter === filter.id ? 'selected' : ''}`} 
          onClick={() => onSelectFilter(filter.id)}
        >
          <div className={`filter-preview ${filter.previewClass || ''}`}>
            {!filter.previewClass && filter.label}
          </div>
          <div className="filter-name">{filter.label}</div>
        </div>
      ))}
    </div>
  );
};

export default FilterGallery;
