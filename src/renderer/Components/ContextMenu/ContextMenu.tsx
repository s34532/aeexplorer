//@ts-nocheck
import React from 'react';
import './ContextMenu.css';

import Color1 from '../../../../assets/aepversions/aep-color-default.svg';
import Color2 from '../../../../assets/aepversions/aep-color-green.svg';
import Color3 from '../../../../assets/aepversions/aep-color-red.svg';
import Color4 from '../../../../assets/aepversions/aep-color-gold.svg';
import { ReactComponent as Block } from '../../../../assets/block.svg';
import { ReactComponent as Check } from '../../../../assets/check.svg';

import { ReactComponent as DeleteIcon } from '../../../../assets/delete-forever.svg';
import { ReactComponent as Pin } from '../../../../assets/pin.svg';
import { ReactComponent as Rename } from '../../../../assets/rename.svg';
import { ReactComponent as Recover } from '../../../../assets/history.svg';
import { ReactComponent as Copy } from '../../../../assets/copy.svg';

const ContextMenu = ({
  showNav,
  hideContext,
  changePriority,
  context,
  xyPosition,
  selectedProject,
  setContext,
  setModalVisibility,
  setSelected,
  pinProject,
  setRenameVisibility,
  recoverAEP,
  setRecoverVisibility,
  cloneProject,

  refreshProject,
  setRefresh,
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
            <div className="c5">
              <Block
                className="vector"
                src={Block}
                onClick={(e) => {
                  e.stopPropagation();
                  changePriority(selectedProject, 4);
                  setContext(false);
                  setRefresh(!refreshProject);
                }}
              ></Block>
            </div>
            <div className="c6">
              <Check
                className="vector"
                src={Check}
                onClick={(e) => {
                  e.stopPropagation();
                  changePriority(selectedProject, 5);
                  setContext(false);
                  setRefresh(!refreshProject);
                }}
              ></Check>
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
              setRecoverVisibility(true);
              setContext(false);
            }}
          >
            <div>Recover</div>
            <Recover className="recover-icon" />
          </li>
          <li
            className="menuElement"
            onClick={(e) => {
              e.stopPropagation();
              cloneProject(selectedProject);
              setContext(false);
            }}
          >
            <div>Clone</div>
            <Copy className="copy-icon" />
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
