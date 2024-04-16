import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { ReactComponent as Logo } from '/assets/Custom LogoGroup.svg';
import { ReactComponent as HomeIcon } from '/assets/home.svg';
import { ReactComponent as Folder } from '/assets/folder.svg';
import { ReactComponent as Settings } from '/assets/settings.svg';
import { ReactComponent as Recent } from '/assets/recent.svg';

function Navbar() {
  return (
    <div className="nav-container">
      <ul className="SidebarList">
        <li>
          <Link
            to={'/'}
            className="custom-link"
            id="nav-list"
            draggable="false"
          >
            <div className="tooltip">
              <HomeIcon className="icon" />
              <span className="tooltiptext">Home</span>
            </div>
          </Link>
        </li>
        <li>
          <Link
            to={'/recent-projects'}
            className="custom-link"
            id="nav-list"
            draggable="false"
          >
            <div className="tooltip">
              <Recent className="icon" />
              <span className="tooltiptext">Recent</span>
            </div>
          </Link>
        </li>
        <li>
          <Link
            to={'/projects'}
            className="custom-link"
            id="nav-list"
            draggable="false"
          >
            <div className="tooltip">
              <Folder className="icon" />
              <span className="tooltiptext">Projects</span>
            </div>
          </Link>
        </li>
      </ul>

      <ul className="SidebarList" id="settings">
        <li>
          <Link
            to={'/settings'}
            className="custom-link"
            id="nav-list"
            draggable="false"
          >
            <div className="tooltip">
              <Settings className="icon" />
              <span className="tooltiptext">Settings</span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
