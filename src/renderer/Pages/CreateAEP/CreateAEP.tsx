import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CreateAEP.css';
import { reloadProjects } from '../../utils';

function CreateAEP() {
  const [val, setVal] = useState("What's your project name?");

  function createProject() {
    window.electron.ipcRenderer.sendMessage('create-aep', val);

    // Force projects.tsx to reload projects.
    reloadProjects();
  }

  const change = (event: any) => {
    setVal(event.target.value);
  };

  return (
    <div>
      <div className="page-container">
        <div className="form-container">
          <form className="project-create-form">
            <input
              id="project-name-input"
              className="input"
              onChange={change}
              type="project-name"
              placeholder="What's your project name?"
              autoFocus
            ></input>
            <Link to={'/Projects'}>
              <button className="submit" type="submit" onClick={createProject}>
                →
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAEP;
