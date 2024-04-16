//@ts-nocheck
import React from 'react';
import './ContextMenu.css';

import Color1 from '../../../../assets/aepversions/aep-color-default.svg';
import Color2 from '../../../../assets/aepversions/aep-color-green.svg';
import Color3 from '../../../../assets/aepversions/aep-color-red.svg';
import Color4 from '../../../../assets/aepversions/aep-color-gold.svg';
import { ReactComponent as DeleteIcon } from '../../../../assets/delete-forever.svg';
import { ReactComponent as Pin } from '../../../../assets/pin.svg';
import { ReactComponent as Rename } from '../../../../assets/rename.svg';

const ContextMenu = ({
  showNav,
  hideContext,
  refreshProject,
  changePriority,
  context,
  xyPosition,
  selectedProject,
  setContext,
  setRefresh,
  setModalVisibility,
  setSelected,
  pinProject,
  setRenameVisibility,
}) => {
  return (
    <div
      className="context-container"
      onContextMenu={showNav}
      onClick={hideContext}
    >
      {context && (
        <ul
          style={{ top: xyPosition.y, left: xyPosition.x }}
          className="rightClick"
        >
          <div className="colors-container">
            <div className="c1">
              <img
                className="vector"
                src={Color1}
                onClick={(e) => {
                  e.stopPropagation();
                  changePriority(selectedProject, 0);
                  setContext(false);
                  setRefresh(!refreshProject);
                }}
              />
            </div>

            <div className="c2">
              <img
                className="vector"
                src={Color2}
                onClick={(e) => {
                  e.stopPropagation();
                  changePriority(selectedProject, 1);
                  setContext(false);
                  setRefresh(!refreshProject);
                }}
              />
            </div>
            <div className="c3">
              <img
                className="vector"
                src={Color3}
                onClick={(e) => {
                  e.stopPropagation();
                  changePriority(selectedProject, 2);
                  setContext(false);
                  setRefresh(!refreshProject);
                }}
              />
            </div>
            <div className="c4">
              <img
                className="vector"
                src={Color4}
                onClick={(e) => {
                  e.stopPropagation();
                  changePriority(selectedProject, 3);
                  setContext(false);
                  setRefresh(!refreshProject);
                }}
              />
            </div>
          </div>

          <li
            className="menuElement"
            onClick={(e) => {
              e.stopPropagation();
              pinProject(selectedProject);
              setContext(false);
            }}
          >
            <div>Pin</div>
            <Pin className="pin-icon" />
          </li>
          <li
            className="menuElement"
            onClick={(e) => {
              e.stopPropagation();
              setSelected(selectedProject);
              setRenameVisibility(true);
            }}
          >
            <div>Rename</div>
            <Rename className="rename-icon" />
          </li>
          <li
            className="menuElement"
            onClick={(e) => {
              e.stopPropagation();
              setSelected(selectedProject);
              setModalVisibility(true);
            }}
          >
            <div>Delete</div>
            <DeleteIcon className="delete-icon" />
          </li>
        </ul>
      )}
    </div>
  );
};

export default ContextMenu;
