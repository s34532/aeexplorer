import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage/HomePage';
import Projects from './Pages/Projects/Projects';
import Settings from './Pages/Settings/Settings';
import CreateAEP from './Pages/CreateAEP/CreateAEP';
import Recent from './Pages/RecentProjects/Recent';
import Navbar from './Components/Navbar/Navbar';

import { useEffect } from 'react';
import { reloadProjects } from './utils';

export default function App() {
  useEffect(() => {
    console.log('main useEffect');
    reloadProjects();
  });

  return (
    <>
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
