import React, { useState } from 'react';
import './SearchComponent.css';

const SearchComponent = ({ onSearch, onToggleFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search listings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button className="filter-button" onClick={onToggleFilters}>Filters</button>
    </div>
  );
};

export default SearchComponent;
