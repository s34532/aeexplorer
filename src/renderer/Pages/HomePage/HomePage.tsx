import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { ReactComponent as DownArrow } from '../../../../assets/down-arrow.svg';
import { Link } from 'react-router-dom';
import { ReactComponent as ChevronRight } from '../../../../assets/chevron-right.svg';
import { motion, AnimatePresence } from 'framer-motion';
interface Props {}

const HomePage = (props: Props) => {
  const [projectsLength, setProjectsLength] = useState(0);
  const [hasProjects, setHasProjects] = useState(false);

  function projectNames() {
    if (projectsLength >= 2) {
      return (
        <>
          <div className="big-title">
            You have <span className="highlighted-text">{projectsLength}</span>{' '}
            Projects!
          </div>
          <p className="homepage-text">
            Continue optimizing your workflow today!
          </p>

          <div className="homepage-button-container">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="box"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link
                to={hasProjects ? '/projects' : '/CreateAEP'}
                className="start-button"
                onDragStart={(e) => e.preventDefault()}
              >
                <span className="button-text">View Projects</span>
              </Link>
            </motion.div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="big-title">
            You have <span className="highlighted-text">{projectsLength}</span>{' '}
            project waiting for you!
          </div>
          <p className="homepage-text">
            Start optimizing your workflow and create today!
          </p>

          <div className="homepage-button-container">
            <Link
              to={hasProjects ? '/projects' : '/CreateAEP'}
              className="start-button"
            >
              <span className="button-text">View project</span>
            </Link>
          </div>
        </>
      );
    }
  }

  function getProjectsLength() {
    window.electron.ipcRenderer.sendMessage('get-project-count');
    window.electron.ipcRenderer.once('get-project-count', (response: any) => {
      setProjectsLength(response);
    });
  }

  useEffect(() => {
    getProjectsLength();

    if (projectsLength > 0) {
      console.log(projectsLength);
      setHasProjects(true);
    }
  }, [projectsLength]);

  return (
    <div>
      <div className="container">
        <div className="title-block">
          <div className="title-text">
            {' '}
            <span>Home</span>
          </div>
        </div>
        <div className="block-container">
          <div className="content-1">
            {hasProjects ? (
              projectNames()
            ) : (
              <>
                <div className="big-title">
                  After Effects Project management made{' '}
                  <span className="highlighted-text">effortless.</span>
                </div>
                <p className="homepage-text">
                  Organize your After Effects Projects all in one location.
                </p>

                <div className="homepage-button-container">
                  <Link
                    to={hasProjects ? '/projects' : '/CreateAEP'}
                    className="start-button"
                  >
                    <span className="button-text">Start now</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
