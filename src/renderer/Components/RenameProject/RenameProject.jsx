import React from 'react';
import './RenameProject.css';
import { ReactComponent as RemoveSelection } from '../../../../assets/circle-x.svg';
import { useState } from 'react';

function RenameProject({
  selectedProject,
  refreshProject,
  setRefresh,
  setContext,
  setRenameVisibility,
  setNameChanged,
  nameChanged,
  setNotificationText,
  setNotificationVisibility,
  setResponseCode,
}) {
  const [newName, setName] = useState('');
  function handleRename(e) {
    setName(e.target.value);
  }
  function showNotification(response) {
    setNotificationText(response[1]);
    setResponseCode(response[0]);
    setNotificationVisibility(true);
  }

  function handleSubmit() {
    window.electron.ipcRenderer.sendMessage('rename-project', [
      selectedProject,
      newName,
    ]);

    window.electron.ipcRenderer.once('rename-project', (response) => {
      showNotification(response);
    });
  }

  return (
    <div>
      <div
        id="modal-visibility"
        className="delete-modal-container-background"
      ></div>
      <div id="modal-visibility" className="delete-modal-container">
        <div className="delete-item-title-row">
          <div>Rename {selectedProject + '.aep'}</div>
          <RemoveSelection
            className="remove-icon"
            onClick={(e) => {
              e.stopPropagation();
              setRenameVisibility(false);
              setContext(false);
            }}
          />
        </div>
        <div className="rename-item-center-row">
          <form>
            <input
              autoFocus
              placeholder={selectedProject}
              className="rename-form"
              onChange={handleRename}
            ></input>
          </form>
        </div>
        <div className="rename-bottom-row">
          <button
            className="cancel-button"
            onClick={(e) => {
              e.stopPropagation();
              setRenameVisibility(false);
              setContext(false);
            }}
          >
            Cancel
          </button>

          <button
            className="submit-button"
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
              setRefresh(!refreshProject);
              setNameChanged(!nameChanged);
              setRenameVisibility(false);
              setContext(false);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default RenameProject;
