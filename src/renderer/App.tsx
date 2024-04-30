import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage/HomePage';
import Projects from './Pages/Projects/Projects';
import Settings from './Pages/Settings/Settings';
import CreateAEP from './Pages/CreateAEP/CreateAEP';
import Recent from './Pages/RecentProjects/Recent';
import Navbar from './Components/Navbar/Navbar';
import { ReactComponent as Logo } from '../../assets/icon.svg';
import { ReactComponent as Minimize } from '../../assets/minimize.svg';
import { ReactComponent as Maximize } from '../../assets/maximize.svg';
import { ReactComponent as Close } from '../../assets/close.svg';

import { useEffect } from 'react';
import { reloadProjects } from './utils';

export default function App() {
  function handleWindow(event) {
    console.log(event);
    window.electron.ipcRenderer.sendMessage('window-functions', [event]);
  }
  useEffect(() => {
    console.log('main useEffect');
    reloadProjects();
  });

  return (
    <>
      <div className="menubar">
        <Logo className="menu-logo" />
        <div className="menu-title">AEExplorer</div>
        <div className="menu-buttons">
          <Minimize
            onClick={(e) => {
              e.stopPropagation();
              handleWindow('minimize');
            }}
            className="window-buttons"
            id="other-button"
          />
          <Maximize
            onClick={(e) => {
              e.stopPropagation();
              handleWindow('maximize');
            }}
            className="window-buttons"
            id="other-button"
          />
          <Close
            id="close-button"
            onClick={(e) => {
              e.stopPropagation();
              handleWindow('close');
            }}
            className="window-buttons"
            id="close-button"
          />
        </div>
      </div>

      <div className="app-container">
        <div className="sidebar">
          <Navbar />
        </div>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recent-projects" element={<Recent />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/CreateAEP" element={<CreateAEP />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
