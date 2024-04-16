import React from 'react';
import './DeleteProject.css';
import { ReactComponent as RemoveSelection } from '../../../../assets/circle-x.svg';
async function removeProject(selectedProject) {
  window.electron.ipcRenderer.sendMessage('delete-project', [selectedProject]);
}
function DeleteProject({
  setModalVisibility,
  selectedProject,
  refreshProject,
  setRefresh,
  setContext,
}) {
  return (
    <div>
      <div
        id="modal-visibility"
        className="delete-modal-container-background"
      ></div>
      <div id="modal-visibility" className="delete-modal-container">
        <div className="delete-item-title-row">
          <div>Delete project?</div>
          <RemoveSelection
            className="remove-icon"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisibility(false);
              setContext(false);
            }}
          />
        </div>
        <div className="delete-item-center-row">
          If you delete this project, you won't be able to restore it.
        </div>
        <div className="bottom-row">
          <button
            className="cancel-button"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisibility(false);
              setContext(false);
            }}
          >
            Cancel
          </button>
          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              removeProject(selectedProject);
              setRefresh(!refreshProject);
              setModalVisibility(false);
              setContext(false);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProject;
