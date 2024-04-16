import React from 'react';
import './Searchbox.css';
import searchIcon from '/assets/search.svg';
function SearchBox() {
  return (
    <div id="search-box">
      <input
        className="search-input"
        type="text"
        placeholder="Search your projects"
      />
      <img id="search-icon" src={searchIcon} alt="Search Icon" />
    </div>
  );
}

export default SearchBox;
