//@ts-nocheck
import React, { useEffect, useState } from 'react';
import './Recent.css';
import { ReactComponent as DownArrow } from '../../../../assets/down-arrow.svg';

interface Props {}

const Recent = (props: Props) => {
  const [recentArray, setRecent] = useState([]);

  const [refreshArray, refreshSet] = useState(true);
  const [isFlipped, setFlip] = useState(false);

  function setList() {
    window.electron.ipcRenderer.sendMessage('get-recent-projects');
    window.electron.ipcRenderer.once('get-recent-projects', (response: any) => {
      setRecent(response.reverse());
    });
  }

  function reverse() {
    console.log('reverse');
    setRecent(recentArray.reverse());
  }

  function handleOpen(project: string) {
    window.electron.ipcRenderer.sendMessage('open-aep', project);
    window.electron.ipcRenderer.sendMessage('add-recent-aep', project);
  }
  function handleFlip() {
    reverse();
    setFlip(!isFlipped);
  }

  const getList = () => {
    return (
      <ul className="total-projects-list">
        <li>
          <div className="list-title" id="list-element">
            <div id="list-col-1">NAME</div>
            <div id="list-col-2" className="recent-block">
              LAST ACCESSED
              {isFlipped ? (
                <DownArrow
                  style={{
                    transform: 'rotate(180deg) scale(0.7)',
                  }}
                  className="down-arrow-icon"
                  onClick={handleFlip}
                />
              ) : (
                <DownArrow
                  style={{
                    transform: 'scale(0.7)',
                  }}
                  className="down-arrow-icon"
                  onClick={handleFlip}
                />
              )}
            </div>
          </div>
          <hr className="line"></hr>

          {recentArray.map((obj, index) => (
            <li key={index} className="list-element">
              <div
                className="list-container"
                onClick={(e) => {
                  e.stopPropagation();

                  handleOpen(obj.name);

                  refreshSet(!refreshArray);
                }}
              >
                <div id="list-col-1" className="list-project-name">
                  {obj.name}
                </div>
                <div id="list-col-2" id="project-date">
                  {obj.date}
                </div>
              </div>
              <hr className="line"></hr>
            </li>
          ))}
        </li>
      </ul>
    );
  };

  useEffect(() => {
    setList();
  }, [refreshArray]);
  //
  return (
    <div>
      <div className="container">
        <div className="title-block">
          <div className="title-text">Recent</div>
        </div>
      </div>

      <div className="recent-container">
        <div className="content-column" id="load-animation">
          <div className="recent-projects">
            <div className="total-projects-title"></div>
            {getList()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recent;
