import { ipcMain } from 'electron/main';
import { useEffect, useState } from 'react';
import './Settings.css';

interface Props {}
const Settings = (props: Props) => {
  const [projectsDirectory, setDirectory] = useState('');
  const handleDirectoryChange = (event) => {
    window.electron.ipcRenderer.sendMessage('show-directory-select');
  };

  function getDirectory() {
    window.electron.ipcRenderer.sendMessage('get-directory');
    window.electron.ipcRenderer.once('get-directory', (response: string) => {
      console.log(response);
      setDirectory(response);
    });
  }

  useEffect(() => {
    getDirectory();
  }, []);
  return (
    <div>
      <div className="settings-container">
        <div className="title-block">
          <div className="title-text">Settings</div>
        </div>

        <div className="settings-content">
          <div className="setting-directory">
            <div className="setting-column-1">
              <div className="directory-text">Projects Directory</div>
              <div className="item-text">{projectsDirectory}</div>
            </div>

            <div className="setting-column-2">
              <button
                onClick={handleDirectoryChange}
                className="change-project-directory-button"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
