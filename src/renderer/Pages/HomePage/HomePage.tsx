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
  function sillyText(word) {
    var span = [];
    for (var i = 0; i < word.length; i++) {
      span.push(
        <motion.span
          whileHover={{
            fontWeight: 700,
            transition: { duration: 0.05 },
          }}
          className="font-change"
        >
          {word[i]}
        </motion.span>,
      );
    }
    return span;
  }

  function projectNames() {
    if (projectsLength >= 2) {
      return (
        <>
          <div className="big-title">
            <motion.div
              whileTap={{ scale: 1.05 }}
              whileHover={{ scale: [null, 1.035, 1.03] }}
              drag
              dragSnapToOrigin={true}
              dragTransition={{
                bounceStiffness: 500,
                bounceDamping: 10,
              }}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.05}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              {sillyText('You Have')}{' '}
              <span className="highlighted-text">{projectsLength}</span>{' '}
              {sillyText('Projects!')}
            </motion.div>
          </div>

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
            <motion.div
              whileTap={{ scale: 1.05 }}
              whileHover={{ scale: [null, 1.035, 1.03] }}
              drag
              dragSnapToOrigin={true}
              dragTransition={{
                bounceStiffness: 500,
                bounceDamping: 10,
              }}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.05}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <span className="highlighted-text">{projectsLength}</span>{' '}
              {sillyText('Project!')}
            </motion.div>
          </div>

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
              >
                <span className="button-text">View project</span>
              </Link>
            </motion.div>
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
                  {
                    <motion.div
                      whileTap={{ scale: 1.05 }}
                      whileHover={{ scale: [null, 1.035, 1.03] }}
                      drag
                      dragSnapToOrigin={true}
                      dragTransition={{
                        bounceStiffness: 500,
                        bounceDamping: 10,
                      }}
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.05}
                      transition={{ duration: 0.5, type: 'spring' }}
                    >
                      {sillyText('Lets start.')}
                    </motion.div>
                  }
                </div>
                <p className="homepage-text">
                  Organize your After Effects Projects All in One Location.
                </p>

                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="box"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="homepage-button-container">
                    <Link
                      to={hasProjects ? '/projects' : '/CreateAEP'}
                      className="start-button"
                    >
                      <span className="button-text">Start now</span>
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
