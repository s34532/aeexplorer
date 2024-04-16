import React from 'react';
//@ts-nocheck
import { ReactComponent as Swap } from '/assets/swap.svg';
import { ReactComponent as Sort } from '/assets/sort.svg';
import './SortBox.css';
const SortBox = ({ handleSortClick, visibility, setSortValue }) => {
  return (
    <div className="sort-box" onClick={handleSortClick}>
      <Sort className="sort-icon" />

      {visibility ? (
        <ul className="drop-down">
          <li
            id="sort-title"
            onClick={(e) => {
              e.stopPropagation();
              setSortValue(0);
            }}
          >
            Sorting
            <Swap className="swap-icon" />
          </li>
          <hr className="line-seperator"></hr>
          <li
            id="sort-element"
            onClick={(e) => {
              e.stopPropagation();
              setSortValue(0);
            }}
          >
            Most recent
          </li>
          <li
            id="sort-element"
            onClick={(e) => {
              e.stopPropagation();
              setSortValue(1);
            }}
          >
            Least recent
          </li>

          <li
            id="sort-element"
            onClick={(e) => {
              e.stopPropagation();
              setSortValue(2);
            }}
          >
            Size
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default SortBox;
