import React, { useState } from 'react';
import './RecoverProject.css';
import { ReactComponent as RemoveSelection } from '../../../../assets/circle-x.svg';

function RecoverProject({
  selectedProject,
  refreshProject,
  setRefresh,
  setContext,
  setRecoverVisibility,
  setNotificationText,
  setNotificationVisibility,
  setResponseCode,
}) {
  function showNotification(response) {
    setNotificationText(response[1]);
    setResponseCode(response[0]);
    setNotificationVisibility(true);
  }
  function recoverAEP(name) {
    console.log(name);
    window.electron.ipcRenderer.sendMessage('recover-aep', [name]);
    window.electron.ipcRenderer.once('recover-aep', (response) => {
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
          <div>Recover from Auto-Save</div>
          <RemoveSelection
            className="remove-icon"
            onClick={(e) => {
              e.stopPropagation();
              setRecoverVisibility(false);
              setContext(false);
            }}
          />
        </div>
        <div className="delete-item-center-row">
          Archive selected project and return to a most recent auto-save.
        </div>
        <div className="bottom-row">
          <button
            className="cancel-button"
            onClick={(e) => {
              e.stopPropagation();
              setRecoverVisibility(false);
              setContext(false);
            }}
          >
            Cancel
          </button>
          <button
            className="recover-button"
            onClick={(e) => {
              e.stopPropagation();
              recoverAEP(selectedProject);
              setRefresh(!refreshProject);
              setRecoverVisibility(false);
              setContext(false);
            }}
          >
            Recover
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecoverProject;
