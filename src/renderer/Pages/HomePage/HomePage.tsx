//@ts-nocheck
import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { ReactComponent as DownArrow } from '../../../../assets/down-arrow.svg';
import { Link } from 'react-router-dom';

interface Props {}

const HomePage = (props: Props) => {
  return (
    <div>
      <div className="container">
        <div className="title-block">
          <div className="title-text">Home</div>
        </div>

        <div className="block-container">
          <div className="content-1">
            <div className="big-title">
              After Effects Project management made{' '}
              <span className="highlighted-text">effortless.</span>
            </div>
            <p className="homepage-text">
              Organize your After Effects Projects all in one location.
            </p>

            <Link to={'/CreateAEP'} className="start-button">
              <button className="start-button">Start now</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
